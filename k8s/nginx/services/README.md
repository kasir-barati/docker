# Services

```shell
kubectl create -f deployment.yaml
kubectl create -f service-definition.yaml
minikube service list 
┌─────────────┬───────────────┬──────────────┬─────────────────────────────┐
│  NAMESPACE  │     NAME      │ TARGET PORT  │             URL             │
├─────────────┼───────────────┼──────────────┼─────────────────────────────┤
│ default     │ exposed-nginx │ 80           │ http://192.168.59.101:30000 │
│ default     │ kubernetes    │ No node port │                             │
│ kube-system │ kube-dns      │ No node port │                             │
└─────────────┴───────────────┴──────────────┴─────────────────────────────┘
minikube service exposed-nginx --url
```

> [!IMPORTANT]
>
> `NodePort` on Minikube exposes the port on the Minikube node, not on your laptop's `localhost`. That's different from a real multi-node cluster, where `NodePort` would be open on every node's actual host IP.
>
> <details>
> <summary><code>pod.yaml</code></summary>
>
> ```yaml
> apiVersion: v1
> kind: Pod
> metadata:
>   name: myapp-pod
>   labels:
>     app: myapp
> spec:
>   containers:
>     - name: nginx
>       image: nginx
> ```
>
> </details>
> <details>
> <summary><code>service-definition.yaml</code></summary>
>
> ```yaml
> apiVersion: v1
> kind: Service
> metadata:
>   name: exposed-nginx
>   labels:
>     app: nginx
> spec:
>   type: NodePort
>   ports:
>     - port: 80        # service's port
>       targetPort: 80  # pod's port
>       nodePort: 30000 # host's port
>   selector:
>     app: myapp
> ```
>
> </details>
>
> To see the IP of Minikube run: `minikube ip`. And now if you curl it: `curl 192.168.59.101:30000` you will get the default nginx welcome page.