# Service account token demo

A minimal Node.js app that runs inside a pod, reads its own bound service account token, and uses it to call the Kubernetes API and list the pods in its namespace.

## What it shows

- A `ServiceAccount` (`pod-lister`) with RBAC (`Role` + `RoleBinding`) granting only `get`/`list` on `pods`.
- A `Deployment` whose pod runs as that service account. Kubernetes automatically mounts a **projected volume** at `/var/run/secrets/kubernetes.io/serviceaccount/` containing `token`, `ca.crt`, and `namespace` — this is the bound-token mechanism, not the old long-lived Secret-based token.
- The app reads those three files and calls `https://kubernetes.default.svc/api/v1/namespaces/<ns>/pods` with `Authorization: Bearer <token>`.

You can confirm the token is bound (not a static Secret) by decoding its JWT payload — it contains `kubernetes.io.pod.name` and `kubernetes.io.pod.uid` (tying it to this exact pod) and an `exp` claim (it expires and is rotated by the kubelet automatically).

## Files

```
app/
  package.json
  index.mjs          # reads the SA token/CA/namespace, calls the k8s API
  Dockerfile
manifests/
  serviceaccount.yaml
  role.yaml
  rolebinding.yaml
  deployment.yaml    # Deployment + Service
```

## Deploy to minikube

Build the image directly into minikube's Docker daemon so no registry push is needed:

```bash
cd k8s/service-account-token-demo
eval $(minikube docker-env)
docker build -t sa-token-demo:1.0 ./app
kubectl apply -f manifests/
kubectl rollout status deployment/sa-token-demo
```

> [!NOTE]
>
> `eval $(minikube docker-env)` only affects the current shell — it points the `docker` CLI at minikube's internal Docker daemon instead of your host's. It doesn't touch your Docker installation or config, and it's easy to undo with `eval $(minikube docker-env -u)`. Any other terminal (or a new one) still talks to your normal host Docker daemon, so your regular `docker build` / `docker compose` workflows outside minikube are unaffected. Just be aware that images built while the minikube env is active go into minikube's internal Docker, not your host's — they won't show up in `docker images` on the host or be usable by a host-side `docker-compose` unless you unset the env first. Tip: use a dedicated terminal tab for minikube work so you don't have to keep toggling it.

## Test it

Hit the app's `/pods` endpoint from inside the cluster:

```bash
POD=$(kubectl get pod -l app=sa-token-demo -o jsonpath='{.items[0].metadata.name}')
kubectl exec "$POD" -- wget -qO- http://localhost:3000/pods
```

Expected output: JSON with the namespace and the list of pods (at minimum, the app's own pod), proving the app authenticated to the API server using only its bound service account token. Inspect the mounted volume and the token's claims:

```bash
# confirm it's a projected volume, not a plain Secret mount
kubectl get pod "$POD" -o jsonpath='{.spec.volumes[0]}'

# decode the JWT payload (no signature verification, just to read the claims)
kubectl exec "$POD" -- cat /var/run/secrets/kubernetes.io/serviceaccount/token \
  | cut -d. -f2 | base64 -d | python3 -m json.tool
```

You should see `kubernetes.io.pod.name` matching your pod, and an `exp` timestamp — proof this token is short-lived and pod-scoped.

```json
{
  "aud": ["https://kubernetes.default.svc.cluster.local"],
  "exp": 1820114048,
  "iat": 1788578048,
  "iss": "https://kubernetes.default.svc.cluster.local",
  "jti": "80cdfe31-2b32-4170-8d3a-ad317fff5aff",
  "kubernetes.io": {
    "namespace": "default",
    "node": {
      "name": "minikube",
      "uid": "b312dc67-1772-4825-a09b-ca0ea4c9c5c4"
    },
    "pod": {
      "name": "sa-token-demo-b4f68b668-krvmv",
      "uid": "37bcc748-a5ab-438b-8ac8-08fb65d5684b"
    },
    "serviceaccount": {
      "name": "pod-lister",
      "uid": "c4d43799-5697-43e2-a2a4-d735f016a6f3"
    },
    "warnafter": 1788581655
  },
  "nbf": 1788578048,
  "sub": "system:serviceaccount:default:pod-lister"
}
```

To test the RBAC boundary, try deleting the `RoleBinding` and re-hitting `/pods` — the call should now fail with a 403 `Forbidden`, since the service account has no permissions without it:

```bash
kubectl delete rolebinding pod-lister-can-read-pods
kubectl exec "$POD" -- wget -qO- http://localhost:3000/pods
kubectl apply -f manifests/rolebinding.yaml   # restore it
```

Clean up:

```bash
kubectl delete -f manifests/
```

## Why an app would ever do this

It's unusual for typical CRUD backends, but common for anything that needs to be _cluster-aware_. Some real examples:

- **Client-side service discovery / peer discovery.** A stateful app (e.g. a cache cluster, a custom leader-election setup) lists pods matching its own label selector to find its peers' IPs, instead of relying on DNS.
- **Custom autoscalers or schedulers.** A controller watches custom metrics and calls the API to scale a `Deployment` or evict a pod — this is literally how the Horizontal Pod Autoscaler and Cluster Autoscaler work, just as your own app instead of a built-in controller.
- **Internal admin/status dashboards or chatops bots.** A small internal tool that lets engineers see "which pods are running, which are crash-looping" from Slack, without giving them raw `kubectl` access — the bot's own RBAC role limits it to read-only.
- **Dynamic config reload.** An app watches a `ConfigMap` for changes via the API (watch endpoint) instead of relying on the kubelet's slower volume-sync, so config changes take effect within milliseconds.
- **Operators / CRD controllers.** Any app implementing a Kubernetes Operator (e.g. a database operator that creates backup `Jobs` when it sees a new `Backup` custom resource) is, at its core, just a process using its service account token to call the API — this demo is that pattern at its smallest.

The common thread: the app needs to _react to or manage_ cluster state, not just serve its own business logic.
