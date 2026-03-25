.ONESHELL:
.PHONY: init start stop test clean format help

init:
	cp .env.example .env
	cd book-api && npm ci
	cd book-api-integration-tests && npm ci

start:
	docker compose up --build -d

stop:
	docker compose down -v

test:
	clear
	docker compose --profile integration-tests down -v
	docker compose --profile integration-tests up --build -d
	docker compose wait book-api-integration-tests
	mkdir -p logs
	docker compose logs book-api-integration-tests > logs/book-api-integration-tests.log 2>&1
	docker compose logs setup-zitadel > logs/setup-zitadel.log 2>&1
	docker compose logs zitadel > logs/zitadel.log 2>&1

clean:
	rm -rf logs
	find . -type d -name node_modules -prune -print -exec rm -rf '{}' +


format:
	pnpx prettier . -w -u

help:
	@echo "Available commands:"
	@echo "  start:   Start the application using Docker Compose"
	@echo "  stop:    Stop the application and remove volumes"
	@echo "  clean:   Remove logs"
	@echo "  format:  Format the code using Prettier"
	@echo "  test:    Run integration tests"
	@echo "  init:    Initialize the project"
	@echo "  help:    Show this help message"
