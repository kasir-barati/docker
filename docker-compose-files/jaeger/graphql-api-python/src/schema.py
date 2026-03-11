"""
GraphQL schema composition.

Merges all resolver classes into the root Query type using
Strawberry's `merge_types` utility — similar to how NestJS
composes resolvers from separate modules into a single schema.
"""

import strawberry
from strawberry.tools import merge_types

from src.resolvers.system_resolver import SystemResolver
from src.resolvers.user_resolver import UserResolver


Query = merge_types("Query", (SystemResolver, UserResolver))

schema = strawberry.Schema(query=Query)
