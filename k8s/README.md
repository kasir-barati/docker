# Kubernetes

- [nginx](./nginx/).

## Useful Commands

Delete a group of pods by their label: 

```
kubectl get pods --show-labels
kubectl delete pods -l name=busybox-pod
```
