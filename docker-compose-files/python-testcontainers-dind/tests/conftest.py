import sys
from pathlib import Path


# Add src and tests directories to Python path
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
tests_path = project_root / "tests"
sys.path.insert(0, str(src_path))
sys.path.insert(1, str(tests_path))

# Automatically discover all fixture files recursively
fixture_files = []
tests_dir = Path(__file__).parent  # Gets the tests/ directory
for file in tests_dir.rglob("*_fixture.py"):  # rglob for recursive search
    if file.name != "__init__.py":
        # Convert path to module notation (e.g., whatever.whatever_fixture)
        relative_path = file.relative_to(tests_dir)
        module_path = str(relative_path.with_suffix("")).replace("/", ".")
        fixture_files.append(module_path)

# Register the fixture module so pytest can discover fixtures
pytest_plugins = fixture_files
