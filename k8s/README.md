# Kubernetes

- [nginx](./nginx/).

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
