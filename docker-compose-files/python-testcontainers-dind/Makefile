.ONESHELL:

PYTHON_VERSION = 3.13
VENV_PATH = .venv
PYTHON = $(shell [ -f $(VENV_PATH)/bin/python3 ] && echo $(VENV_PATH)/bin/python3 || echo python3)

venv: requirements.dev.txt requirements.txt
	@which uv > /dev/null || (echo "Error: uv is not installed. Please install uv: https://docs.astral.sh/uv/getting-started/installation/" && exit 1)
	uv venv $(VENV_PATH) --python=$(PYTHON_VERSION)
	uv pip install -r requirements.dev.txt -r requirements.txt --python=$(PYTHON_VERSION)

start:
	$(PYTHON) src/main.py

test:
	$(PYTHON) -m pytest tests/ -v -s

.PHONY: start test