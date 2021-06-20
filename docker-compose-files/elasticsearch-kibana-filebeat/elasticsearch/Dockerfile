ARG ELASTIC_PORT1
ARG ELASTIC_PORT2
ARG EFK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/elasticsearch/elasticsearch:${EFK_VERSION}

COPY ./config/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Add your elasticsearch plugins setup here
# Example: RUN elasticsearch-plugin install analysis-icu
EXPOSE ${ELASTIC_PORT1}
EXPOSE ${ELASTIC_PORT2}