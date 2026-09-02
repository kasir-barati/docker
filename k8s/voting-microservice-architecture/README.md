# Microservice Architecture

Note: voting, result, and worker apps are all hardcoded and look for a connection string like this:

- `redis://redis:6379`.
- `postgres://db:5432`.

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

  The logs for this issue might look like this:

  ```shell
  $ kubectl logs worker-deployment-6589c8f67b-2cfkx
  System.AggregateException: One or more errors occurred. (No such device or address) ---> System.Net.Internals.SocketExceptionFactory+ExtendedSocketException: No such device or address
     at System.Net.Dns.HostResolutionEndHelper(IAsyncResult asyncResult)
     at System.Net.Dns.EndGetHostAddresses(IAsyncResult asyncResult)
     at System.Net.Dns.<>c.<GetHostAddressesAsync>b__14_1(IAsyncResult asyncResult)
     at System.Threading.Tasks.TaskFactory1.FromAsyncCoreLogic(IAsyncResult iar, Func2 endFunction, Action1 endAction, Task1 promise, Boolean requiresSynchronization)
     --- End of inner exception stack trace ---
     at System.Threading.Tasks.Task.ThrowIfExceptional(Boolean includeTaskCanceledExceptions)
     at System.Threading.Tasks.Task1.GetResultCore(Boolean waitCompletionNotification)    at Npgsql.NpgsqlConnector.Connect(NpgsqlTimeout timeout)    at Npgsql.NpgsqlConnector.RawOpen(NpgsqlTimeout timeout)    at Npgsql.NpgsqlConnector.Open(NpgsqlTimeout timeout)    at Npgsql.ConnectorPool.Allocate(NpgsqlConnection conn, NpgsqlTimeout timeout)    at Npgsql.NpgsqlConnection.OpenInternal()    at Worker.Program.OpenDbConnection(String connectionString) in /code/src/Worker/Program.cs:line 50    at Worker.Program.Main(String[] args) in /code/src/Worker/Program.cs:line 19 ---> (Inner Exception #0) System.Net.Internals.SocketExceptionFactory+ExtendedSocketException: No such device or address    at System.Net.Dns.HostResolutionEndHelper(IAsyncResult asyncResult)    at System.Net.Dns.EndGetHostAddresses(IAsyncResult asyncResult)    at System.Net.Dns.<>c.<GetHostAddressesAsync>b__14_1(IAsyncResult asyncResult)    at System.Threading.Tasks.TaskFactory1.FromAsyncCoreLogic(IAsyncResult iar, Func2 endFunction, Action1 endAction, Task`1 promise, Boolean requiresSynchronization)<---
  ```

  `Npgsql.NpgsqlConnector.Connect` → `System.Net.Dns.GetHostAddressesAsync` failing with `ExtendedSocketException: No such device or address`. That's the classic signature of a DNS resolution failure inside a .NET container, not a firewall/timeout/auth issue.

  Since it fails at hostname resolution, **before ever reaching Postgres**, the fix has to be on the "what hostname does the app ask for" side.
