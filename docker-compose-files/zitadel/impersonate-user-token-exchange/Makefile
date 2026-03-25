.ONESHELL:
.PHONY: start stop test logs format help

start:
	docker compose up --build -d

stop:
	docker compose down -v

test:
	make stop
	make start
	node book-api-integration-tests/src/main.spec.js

logs:
	docker compose logs setup-zitadel

format:
	pnpx prettier . -w -u

help:
	@echo "Available commands:"
	@echo "  start:   Start the application using Docker Compose"
	@echo "  stop:    Stop the application and remove volumes"
	@echo "  logs:    Show logs for the setup-zitadel service"
	@echo "  format:  Format the code using Prettier"
	@echo "  test:    Run integration tests"
	@echo "  help:    Show this help message"
