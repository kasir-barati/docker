# Docker Compose Service Configuration Merging

- We cannot reset `network_mode` in an override compose file.

  Docker compose **does not allow you to unset a previously set field** like `network_mode`. If you specify `network_mode: host` in one Compose file, there is no way in another Compose file to reset it back to the default (bridge) or remove it entirely.

  Setting `network_mode: none` disables networking for the container, which is not what we want either.

- If you set a field in the base file (like `network_mode: host`), the override file can only replace it with another value.

  There is **no way to unset a field**; i.e. it can only be replaced or left as-is.

## Solution:

<details>
<summary>Original Compose files</summary>
<table>
<thead><tr><th><code>compose.yml</code></th><th>compose-expose-port.yml</th></tr></thead>
<tbody><tr><td>

```yml
services:
  app:
    build: .
    environment:
      PORT: 3000
    network_mode: host
```

</td><td>

```yml
services:
  app:
    build: .
    ports:
      - 3000:3000
```

</td></tr></tbody>
</table>
</details>

1. **Remove `network_mode: host` from the default Compose file**:
   ```yml
   services:
     app:
       build: .
       environment:
         PORT: 3000
     ports:
       - 3000:3000
   ```
2. **Create separate Compose files** for `network_mode: host`, e.g. `compose-host.yml`:
   ```yml
   services:
     app:
       network_mode: host
   ```
3. Then you can merge them like this: `docker compose -f compose.yml -f compose-host.yml up --build -d`.

   Or you can use `docker compose up --build -d` to create a network and expose the ports.

> [!NOTE]
>
> We do not care about the `ports` in the default compose file when we merge it with the `compose-host.yml` since it will be discarded by Docker. And if we run it on its own it will export the port as it should. So in short we flipped the script by changing how networking is handled.
