# Deployment

In Kubernetes you have a deployment, that deployment creates a replicaset for you, then the replicaset creates pods for you. And inside the pods you have your containers.

```shell
kubectl create -f deployment.yaml
```

> [!TIP]
>
> If you wanted to record the cause of a rollout you must add a `--record` flag to the `kubectl create -f deployment.yaml` command. Then moving onward it records the command which created a new revision.

If you made a change in the deployment config file you can apply them:

```shell
kubectl apply -f deployment.yaml
```

And here are some self-explanatory commands:

```shell
kubectl rollout status deployment my-nginx-deployment
kubectl rollout history deployment my-nginx-deployment
```

## Rollback

To rollback you can simply run:

```shell
kubectl rollout undo deployment deployment-name
```

A new revision/`ReplicaSets` is created **only** when the pod template hash changes, i.e. anything under `spec.template`. The deployment controller literally hashes `spec.template` and compares it to existing `ReplicaSets`; if the hash differs, it creates a new `ReplicaSet` = new revision.

> [!IMPORTANT]
>
> There are things that even if you do change will **NOT** trigger a new revision (they update the Deployment/`ReplicaSet` in place, no rollout):
>
> - `spec.replicas` — scaling up/down.
> - `spec.paused`.
> - `spec.progressDeadlineSeconds`.
> - `spec.revisionHistoryLimit`.
> - `spec.strategy` (changing rollout strategy type/params alone, without a template change).
> - Annotations/labels on the Deployment's own metadata (not `spec.template.metadata`).

So the rule of thumb: if it's outside `spec.template`, it won't create a new revision. Only what's inside `spec.template` counts, because that's what actually gets rolled out to pods. For example try to add a new label to the `spec.template.metadata.labels`.
