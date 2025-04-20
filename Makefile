.PHONY: dev prod build logs clean

# Development commands
dev-up:
	docker compose -f .docker/compose.yml up -d db

dev-build:
	docker compose -f .docker/compose.yml up --build

dev-down:
	docker compose -f .docker/compose.yml down

# Production commands
prod:
	docker compose -f .docker/compose.prod.yml up -d

prod-build:
	docker compose -f .docker/compose.prod.yml up -d --build

prod-down:
	docker compose -f .docker/compose.prod.yml down

# Utility commands
logs:
	docker compose -f .docker/compose.prod.yml logs -f

ps:
	docker compose -f .docker/compose.prod.yml ps

# Cleanup commands
clean:
	docker compose -f .docker/compose.prod.yml down -v
	docker compose -f .docker/compose.yml down -v
	docker system prune -f

# Help command
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment"
	@echo "  dev-build    - Build and start development environment"
	@echo "  dev-down     - Stop development environment"
	@echo "  prod         - Start production environment"
	@echo "  prod-build   - Build and start production environment"
	@echo "  prod-down    - Stop production environment"
	@echo "  logs         - View production logs"
	@echo "  ps           - List running containers"
	@echo "  clean        - Remove all containers, volumes, and prune system"
	@echo "  help         - Show this help message"
