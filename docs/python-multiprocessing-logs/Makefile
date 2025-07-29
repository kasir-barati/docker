.ONESHELL:

PYTHON = $(shell [ -f ./venv/bin/python3 ] && echo ./venv/bin/python3 || echo python3)
PIP = ./venv/bin/pip

create_venv:
	python3 -m venv .venv
	chmod +x .venv/bin/activate
	source .venv/bin/activate

activate_venv: create_venv
	. .venv/bin/activate

clean:
	rm -rf .venv

start:
	$(PYTHON) -m src.main
