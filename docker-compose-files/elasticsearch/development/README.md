## Elasticsearch

> With this configs you can dockerize elasticsearch with a good configs in the development/test mode. not production.
> For the production you have to use cluster-elasticsearch configs.

### Notes

- The default username: elastic
- The default password: changeme
- You can disable login via changing `xpack.security.enabled` value to `false`
- This config `xpack.license.self_generated.type: basic` activate free features of the `xpack` plugin.
- [For more info](https://www.elastic.co/guide/en/elasticsearch/reference/7.13/security-minimal-setup.html)
- Other users password generated automatically
  - You can read more [here](https://www.elastic.co/guide/en/elasticsearch/reference/7.13/setup-passwords.html)
