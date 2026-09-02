# Kubernetes

- [nginx](./nginx/).

## Services

So the name you gave them are similar to the service name we have in a docker compose file where containers can see each other by their service name. So let's imagine in your code you have something like this in your NodeJS app:

```ts
const redis = new Redis("redis://redis:6379")
```

Then when you are writing your compose file you write:

```yaml
services:
  backend:
    # ...
  redis: # 👈 This is what I am talking about
    image: redis:7-alpine
    # ...
```

But in Kubernetes you need to have a service to expose your replicated apps and even internal services cannot see each other unless exposed through a service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis # 👈 This is what you can then use in your app.
  labels:
    app: redis
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
```

<details>
<summary>And for completeness sake here is how its </summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis-pod
  labels:
    app: redis
  annotations:
    description: 'Redis instance used by voting app'
spec:
  containers:
    - name: redis
      image: redis:7-alpine
      ports:
        - containerPort: 6379
          name: redis
```

</details>

## Labels

Kubernetes labels must be short, max 63 chars, just letter and no whitespaces. So in case you wonder then how can you write a description you can always use `annotations`.

## Networking

Kubernetes only manages container orchestration, not connectivity. By default:

- Pods can talk to each other only within the same node.
- Cross-node Pod communication, service discovery, and load balancing do not work.

You must install a Container Network Interface (CNI) plugin (e.g., [Calico](https://docs.tigera.io/calico/latest/about), [Flannel](https://github.com/flannel-io/flannel), [Cilium](https://cilium.io)) to enable:

- Pod-to-Pod networking across nodes.
- Cluster-internal service IPs.
- Network policies (if needed).

## Useful Commands

Delete a group of pods by their label: 

```
kubectl get pods --show-labels
kubectl delete pods -l name=busybox-pod
```
