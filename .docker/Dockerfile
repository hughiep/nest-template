FROM node:20-alpine AS base

FROM base AS dependencies

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest-10

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files and set ownership early
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Using non-root user
USER node

# Production stage
FROM base AS production

WORKDIR /app

# Copy source code with correct ownership
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build
RUN npm run migration:run

FROM base AS runner

# Create app directory and non-root user
WORKDIR /app

# Switch to non-root user before installing dependencies
USER node

# Copy built application from builder stage with correct ownership
COPY --chown=node:node --from=production /app/node_modules ./node_modules
COPY --chown=node:node --from=production /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose application port
ENV PORT=5000
EXPOSE 5000

# Start the application
CMD [ "node", "dist/main.js" ]
