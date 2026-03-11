.ONESHELL:
.PHONY: help init install lint format clean test hooks-install hooks-run hooks-update

# Prevent externally activated virtualenvs from conflicting with uv's project .venv
unexport VIRTUAL_ENV

help:
	@echo "Available commands:"
	@echo "  make init          - First-time setup (install uv, create venv, install deps, setup hooks)"
	@echo "  make install       - Install/update dependencies"
	@echo "  make lint          - Run linters (check only)"
	@echo "  make lint-fix      - Run linters and auto-fix issues"
	@echo "  make format        - Format code with ruff"
	@echo "  make hooks-install - Install git pre-commit and pre-push hooks"
	@echo "  make hooks-run     - Run hooks manually on all files"
	@echo "  make hooks-update  - Update hook versions"
	@echo "  make clean         - Clean up artifacts"
	@echo "  make test          - Run tests"

init:
	@echo "Installing uv package manager..."
	@command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
	@echo "Creating virtual environment and installing dependencies..."
	uv sync
	@echo "Installing git hooks..."
	uv run pre-commit install --install-hooks
	uv run pre-commit install --hook-type pre-push
	uv run pre-commit install --hook-type commit-msg
	@echo "Setup complete! Run 'docker compose up --build -d' to start the app."

install:
	@echo "Installing dependencies..."
	uv sync

lint:
	@echo "Running linters..."
	uv run ruff check src/

lint-fix:
	@echo "Running linters with auto-fix..."
	uv run ruff check --fix src/

format:
	@echo "Formatting code..."
	uv run ruff format src/
	pnpx prettier . -w -u

clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	@echo "Cleanup complete!"

test:
	@echo "No tests implemented yet."

hooks-install:
	@echo "Installing git hooks..."
	uv run pre-commit install --install-hooks
	uv run pre-commit install --hook-type pre-push
	uv run pre-commit install --hook-type commit-msg
	@echo "Git hooks installed successfully!"

hooks-run:
	@echo "Running hooks on all files..."
	uv run pre-commit run --all-files

hooks-update:
	@echo "Updating hook versions..."
	uv run pre-commit autoupdate
	@echo "Hook versions updated!"
