"""User GraphQL object type."""

import strawberry


@strawberry.type
class User:
    """User type for GraphQL schema."""

    id: int
    name: str
    email: str
    active: bool = True
