.ONESHELL:
.PHONY: start stop test logs format help

start:
	docker compose up --build -d

stop:
	docker compose down -v

test:
	docker compose --profile integration-tests down -v
	docker compose --profile integration-tests up --build -d
	docker compose wait book-api-integration-tests
	mkdir -p logs
	docker compose logs book-api-integration-tests > logs/book-api-integration-tests.log 2>&1
	docker compose logs setup-zitadel > logs/setup-zitadel.log 2>&1
	docker compose logs zitadel > logs/zitadel.log 2>&1

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
