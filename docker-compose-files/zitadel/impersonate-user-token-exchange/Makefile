.ONESHELL:
.PHONY: start stop logs format help

start:
	docker compose up --build -d

stop:
	docker compose down -v

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
	@echo "  help:    Show this help message"
