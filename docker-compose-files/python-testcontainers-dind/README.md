# Python, Testcontainers, DinD

To run integration tests which are using Testcontainers in Python we need to install docker, and start its service.

BTW If you ran into this error message:

```bash
e = HTTPError('500 Server Error: Internal Server Error for url: http+docker://localhost/v1.52/containers/create?name=testcontainers-ryuk-48b1cdca-af99-4bf8-a0df-81dd0c89fa0e')
```

The error was occurring due to two main issues in the Docker-in-Docker (DinD) environment:

1. **Storage Driver Incompatibility**: The default `overlay2` storage driver was causing mount failures with the error `"failed to mount /tmp/containerd-mount... invalid argument"`.
2. **Testcontainers Ryuk Configuration**: The testcontainers library was trying to start a Ryuk container for cleanup, but it wasn't configured properly for the DinD environment.
