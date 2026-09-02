# Microservice Architecture

## Single Instance

To start I'd like to spare you all the details about deployments and replica sets. Thus we're gonna use pods and configure them

```shell
$ cd single-instance
$ kubectl apply -f .
pod/db created
service/db created
pod/redis created
service/redis created
pod/result created
service/result created
service/vote created
pod/vote created
pod/worker created
$ minikube service list
┌─────────────┬────────────┬──────────────┬─────────────────────────────┐
│  NAMESPACE  │    NAME    │ TARGET PORT  │             URL             │
├─────────────┼────────────┼──────────────┼─────────────────────────────┤
│ default     │ db         │ No node port │                             │
│ default     │ kubernetes │ No node port │                             │
│ default     │ redis      │ No node port │                             │
│ default     │ result     │ 8081         │ http://192.168.59.101:31720 │
│ default     │ vote       │ 8080         │ http://192.168.59.101:32747 │
│ kube-system │ kube-dns   │ No node port │                             │
└─────────────┴────────────┴──────────────┴─────────────────────────────┘
```

If you wanna make sure to see if all the pods are running:

```shell
$ kubectl get pods
NAME     READY   STATUS    RESTARTS   AGE
db       1/1     Running   0          27s
redis    1/1     Running   0          27s
result   1/1     Running   0          27s
vote     1/1     Running   0          27s
worker   1/1     Running   0          27s
```

To clean up just run:

```shell
$ kubectl delete -f .
pod "db" deleted from default namespace
service "db" deleted from default namespace
pod "redis" deleted from default namespace
service "redis" deleted from default namespace
pod "result" deleted from default namespace
service "result" deleted from default namespace
service "vote" deleted from default namespace
pod "vote" deleted from default namespace
pod "worker" deleted from default namespace
```

## FAQ

- Your vote/result/worker pod can't reach service redis/postgres, then the single most useful command for it would be: `kubectl get endpoints <service-name>` or `kubectl get endpointslice`. If the endpoint list is empty, the Service's selector doesn't match any pod's labels. You can see this by messing with the selectors of one of the `*service.yaml`.

  Compare `spec.selector` on the Service against `metadata.labels` on the target Pod. E.g. you would be doing something like: `kubectl get pod db --show-labels` vs `kubectl get svc db -o yaml`.
