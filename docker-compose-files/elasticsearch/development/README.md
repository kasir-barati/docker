## Elasticsearch

> With this configs you can dockerize elasticsearch with a good configs in the development/test mode. not production.
> For the production you have to use cluster-elasticsearch configs.

## Prerequisites

- `vm.max_map_count` to at least _262144_ (`sysctl -w vm.max_map_count=262144`). [ref]([https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_set_vm_max_map_count_to_at_least_262144)

### Notes

- The default username: elastic
- The default password: changeme
- You can disable login via changing `xpack.security.enabled` value to `false`
- This config `xpack.license.self_generated.type: basic` activate free features of the `xpack` plugin.
- [For more info](https://www.elastic.co/guide/en/elasticsearch/reference/7.13/security-minimal-setup.html)
- Other users password generated automatically
  - You can read more [here](https://www.elastic.co/guide/en/elasticsearch/reference/7.13/setup-passwords.html)
