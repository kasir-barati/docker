# Use `os.hostname()` in NodeJS to get a Unique Identifier for a Container/Pod

With a replicated NodeJS app I come to realize that I need to have a way to identify each service from the other. Regardless of container orchestrator, whether it is Kubernetes or Docker Swarm (I did not test it with other container orchestrators such as OpenShift, Hasicorp Nomad, Rancher, ...).

```cmd
$ pnpm start:docker
$ docker compose logs
```

# K3s

Why K3s? It is a compact, CNCF‑conformant Kubernetes distribution that runs great in Docker; you can also feed it local images by dropping tar files into `/var/lib/rancher/k3s/agent/images` and have it auto‑import on startup.

We also ask it to write a `kubeconfig` file out to your repo for easy kubectl use.

```cmd
$ pnpm start:kube
$ docker compose -f kind.yml exec -it k3s kubectl logs -l app=node-app --all-containers
```

> [!TIP]
>
> As you probably have already realized we have a `kubectl` installed in `rancher/k3s`:
>
> ```cmd
> $ docker compose -f kind.yml exec -it k3s /bin/sh
> # kubectl get pods -A
> # kubectl logs -l app=node-app --all-containers
> ```

## Refs

- [Lightweight Kubernetes Using Docker Compose](https://sachua.github.io/post/Lightweight%20Kubernetes%20Using%20Docker%20Compose.html).
