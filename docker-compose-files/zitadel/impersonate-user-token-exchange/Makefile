.ONESHELL:
.PHONY: start format help

start:
	docker compose up --build -d

format:
	pnpx prettier . -w -u

help:
	@echo "Available commands:"
	@echo "  start:   Start the application using Docker Compose"
	@echo "  format:  Format the code using Prettier"
	@echo "  help:    Show this help message"
