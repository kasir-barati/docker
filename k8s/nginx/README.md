# Nginx + k8s

In Kubernetes you can create a pod like this:

```shell
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pods nginx
```

## Deployment

To deploy a replicated nginx pod you can follow instruction [here](./deployment/README.md)

## Replication

To learn about how to [replicate nginx in k8s](./replicated/README.md).
