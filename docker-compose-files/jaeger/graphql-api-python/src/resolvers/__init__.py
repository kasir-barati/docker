"""GraphQL resolver definitions."""

from src.resolvers.system_resolver import SystemResolver
from src.resolvers.user_resolver import UserResolver


__all__ = ["SystemResolver", "UserResolver"]
