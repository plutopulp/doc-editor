DC_FILEPATH := docker/docker-compose.yml
DC := docker compose -f $(DC_FILEPATH)

# Helper variables for environment selection
ifeq ($(ENV),dev)
	DC_SERVICES = api web-dev
else
	DC_SERVICES = api web
endif

.PHONY: help build rebuild start stop restart ps logs

# Default target
.DEFAULT_GOAL := help

help:
	@echo "Usage: make <target> [ENV=<dev|prod>]"
	@echo "Targets:"
	@echo "  build: Build the Docker images"
	@echo "  rebuild: Rebuild the Docker images"
	@echo "  start: Start the Docker containers"
	@echo "  stop: Stop the Docker containers"
	@echo "  restart: Restart the Docker containers"
	@echo "  ps: List the Docker containers"
	@echo "  logs: Follow the logs of the Docker containers"

# Docker operations
build:
	$(DC) build $(DC_SERVICES)

rebuild:
	$(DC) build --no-cache $(DC_SERVICES)

start:
	$(DC) up -d $(DC_SERVICES)

stop:
	$(DC) stop $(DC_SERVICES)

restart:
	$(DC) restart $(DC_SERVICES)

ps:
	$(DC) ps

logs:
	$(DC) logs -f $(DC_SERVICES)
