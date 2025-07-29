from functools import lru_cache
from os import getenv
from typing import Literal, TypedDict, cast

Env = Literal["dev", "prod", "test"]
LogLevel = Literal["DEBUG", "INFO"]


class GetEnvVars(TypedDict):
    log_level: LogLevel
    env: Env


@lru_cache
def get_env_vars() -> GetEnvVars:
    def get_mandatory_env(env: str) -> str:
        value = getenv(env)

        if value is None:
            raise Exception(f"{env} is a mandatory environment variable!")

        return value.strip()

    log_level = cast(LogLevel, get_mandatory_env("LOG_LEVEL"))
    env = get_mandatory_env("ENV")
    env = cast(Env, env)

    return {
        "log_level": log_level,
        "env": env,
    }
