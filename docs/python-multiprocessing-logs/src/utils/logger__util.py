import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path

from .get_env_vars_util import get_env_vars


def get_process_logger(
    process_name: str, *, log_file_name: str | None = None, log_dir: str
) -> logging.Logger:
    """
    Creates and configures a logger for a daemon process.

    Parameters:
        `process_name`: The name of the process (used for logger name)
        `log_file_name`: Optional custom log file name. If not provided, uses {process_name}.log
        `log_dir`: Directory where log files will be stored (default: "logs")

    Returns:
        A configured logger instance
    """
    logger = logging.getLogger(process_name)

    # If logger already has handlers, it's already configured
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    env_vars = get_env_vars()

    os.makedirs(log_dir, exist_ok=True)

    if log_file_name is None:
        log_file_name = f"{process_name}.log"

    file_path = Path(log_dir) / log_file_name
    log_level = logging.DEBUG if env_vars["log_level"] == "DEBUG" else logging.INFO
    file_handler = RotatingFileHandler(
        str(file_path), maxBytes=20 * 1024 * 1024, backupCount=10
    )

    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    logger.setLevel(log_level)
    logger.addHandler(file_handler)

    return logger
