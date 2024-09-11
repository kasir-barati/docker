# Elasticsearch-Filebeat-Kibana

#### A very powerful logging system

## Prerequisites

- `vm.max_map_count` to at least _262144_ (`sysctl -w vm.max_map_count=262144`). [ref]([https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#_set_vm_max_map_count_to_at_least_262144)

## how to run the docker-compose file

1. `cd` to the elasticsearch-kibana-filebeat directory
2. `sudo chown root. filebeat/config/filebeat.yml`
3. `docker-compose up --build`

# note

- You can change EFK version via `EFK_VERSION` environmental variable
