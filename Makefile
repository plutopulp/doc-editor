DC_FILEPATH := docker/docker-compose.yml
DC := docker compose -f $(DC_FILEPATH)

# Python API project (used for formatting, etc.)
API_PROJECT_PATH := services/api
POETRY := poetry -C $(API_PROJECT_PATH)

# Helper variables for environment selection
ifeq ($(ENV),dev)
	DC_SERVICES = api web-dev
else
	DC_SERVICES = api web
endif

# Python API code paths (used for formatting / linting)
API_CODE_PATHS := app

.PHONY: help build rebuild build-web rebuild-web build-api rebuild-api start stop restart ps logs format-api lint-api

# Default target
.DEFAULT_GOAL := help

help:
	@echo "Usage: make <target> [ENV=<dev|prod>]"
	@echo "Targets:"
	@echo "  build: Build all Docker images"
	@echo "  rebuild: Rebuild all Docker images (no cache)"
	@echo "  build-web: Build only web service"
	@echo "  rebuild-web: Rebuild only web service (no cache)"
	@echo "  build-api: Build only API service"
	@echo "  rebuild-api: Rebuild only API service (no cache)"
	@echo "  start: Start the Docker containers"
	@echo "  stop: Stop the Docker containers"
	@echo "  restart: Restart the Docker containers"
	@echo "  ps: List the Docker containers"
	@echo "  logs: Follow the logs of the Docker containers"
	@echo "  format-api: Format API Python code with black and isort"
	@echo "  lint-api: Lint API Python code with flake8"

# Docker operations
build:
	$(DC) build $(DC_SERVICES)

rebuild:
	$(DC) build --no-cache $(DC_SERVICES)

build-web:
ifeq ($(ENV),dev)
	$(DC) build web-dev
else
	$(DC) build web
endif

rebuild-web:
ifeq ($(ENV),dev)
	$(DC) build --no-cache web-dev
else
	$(DC) build --no-cache web
endif

build-api:
	$(DC) build api

rebuild-api:
	$(DC) build --no-cache api

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

# Python formatting for API service
format-api:
	@echo "Formatting API Python code..."
	$(POETRY) run black $(API_CODE_PATHS)
	$(POETRY) run isort $(API_CODE_PATHS)

# Python linting for API service
lint-api:
	@echo "Linting API Python code..."
	$(POETRY) run flake8 $(API_CODE_PATHS)

