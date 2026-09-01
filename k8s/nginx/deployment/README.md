In Kubernetes you have a deployment, that deployment creates a replicaset for you, then the replicaset creates pods for you. And inside the pods you have your containers.

```shell
kubectl create -f deployment.yaml
```