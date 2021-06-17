# how to run the docker-compose file

1. `cd` to the elasticsearch-kibana-filebeat directory
2. `sudo chown root. filebeat/config/filebeat.yml`
3. `docker-compose up --build`

# note

- You can change EFK version via `EFK_VERSION` environmental variable
