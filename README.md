# [Project] - API Server

## Pre-requisites

- Node.js 20.x or higher
- pnpm v10

## Development

## Google OAuth Authentication

This project supports Google OAuth for user authentication. Here's how to set it up:

1. Create a Google OAuth Client ID and Secret in the [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or use an existing one
   - Navigate to APIs & Services > Credentials
   - Create an OAuth client ID (Web application type)
   - Add your authorized redirect URI: `http://localhost:5005/auth/google/callback` (for development)
   - Note your Client ID and Client Secret

2. Configure environment variables in your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5005/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

3. Implement the frontend callback page at `/auth/callback` to handle the authentication response.

### Authentication Flow

1. Direct users to `/auth/google` to initiate the Google login flow
2. After successful authentication, users will be redirected to your frontend with tokens
3. The redirect URL will be: `${FRONTEND_URL}/auth/callback?access_token=xxx&refresh_token=yyy`
4. Use the access token for authenticated API requests

## Production
