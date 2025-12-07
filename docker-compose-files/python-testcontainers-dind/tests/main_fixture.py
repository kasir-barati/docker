from collections.abc import AsyncGenerator
import time
import httpx
import pytest_asyncio
from testcontainers.core.container import DockerContainer


@pytest_asyncio.fixture(scope="module")
async def auth_service_container() -> AsyncGenerator[str, None]:
    print("\n\r🚀 FIXTURE setup: mock Auth service")

    PORT = 8080
    container = (
        DockerContainer("wiremock/wiremock:3.9.1")
            .with_name("mock-auth-service")
            .with_exposed_ports(PORT)
            .with_command("--global-response-templating --verbose")
    )

    container.start()

    try:
        wiremock_port = container.get_exposed_port(PORT)
        wiremock_host = container.get_container_host_ip()
        base_url = f"http://{wiremock_host}:{wiremock_port}"

        # Wait for WireMock to be ready
        async with httpx.AsyncClient() as client:
            for _ in range(30):  # Wait up to 30 seconds
                try:
                    response = await client.get(f"{base_url}/__admin/health")
                    if response.status_code == 200:
                        break
                except:
                    pass
                time.sleep(1)
            else:
                raise RuntimeError("WireMock container for Auth Service failed to start!")

        yield base_url

    finally:
        container.stop()
