"""User-related GraphQL resolvers."""

import asyncio

import strawberry

from src.types.user import User
from src.utils.context import get_correlation_id
from src.utils.logger import get_logger
from src.utils.telemetry import get_tracer


logger = get_logger(__name__)
tracer = get_tracer(__name__)


@strawberry.type
class UserResolver:
    """Resolvers for user-related queries."""

    @strawberry.field
    async def user(self, id: int) -> User | None:
        """Fetch user by ID"""
        correlation_id = get_correlation_id()
        logger.info("Fetching user", user_id=id, correlation_id=correlation_id)

        with tracer.start_as_current_span("fetch_user") as span:
            span.set_attribute("user.id", id)

            if correlation_id:
                span.set_attribute("correlation_id", correlation_id)

            # Simulate async database call
            await asyncio.sleep(0.1)

            # Early return pattern: handle not found case first
            if id <= 0:
                logger.warning("Invalid user ID", user_id=id)
                return None

            if id > 1000:
                logger.info("User not found", user_id=id)
                return None

            user = _get_users(1)[0]
            user.id = id

            logger.info(
                "User fetched successfully", user_id=id, user_name=user.name
            )
            return user

    @strawberry.field
    async def users(self, limit: int = 10) -> list[User]:
        """Fetch list of users"""
        correlation_id = get_correlation_id()
        logger.info(
            "Fetching users list", limit=limit, correlation_id=correlation_id
        )

        with tracer.start_as_current_span("fetch_users") as span:
            span.set_attribute("users.limit", limit)

            if correlation_id:
                span.set_attribute("correlation_id", correlation_id)

            # Simulate async database call
            await asyncio.sleep(0.2)

            if limit <= 0:
                logger.warning("Invalid limit", limit=limit)
                return []

            # Generate mock users
            users = _get_users(limit)

            logger.info("Users fetched successfully", count=len(users))

            return users

def _get_users(limit: int) -> list[User]:
    """Helper function to generate mock users."""
    return [
        User(
            id=i,
            name=f"User {i}",
            email=f"user{i}@example.com",
            active=i % 3 != 0,  # Every third user is inactive
        )
        for i in range(1, min(limit + 1, 51))  # Max 50 users
    ]