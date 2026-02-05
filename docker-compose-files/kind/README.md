# Kubernetes IN Docker

We use K3s (lightweight Kubernetes) inside Docker. Running kind purely from a docker compose file is possible but clunky and not officially provided as a simple image, so [K3s](./k3/README.md) is the lightest, least-fuss route here ([read more](https://github.com/kubernetes-sigs/kind/issues/706)).
