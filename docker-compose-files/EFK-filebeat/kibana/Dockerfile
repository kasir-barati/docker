ARG KIBANA_PORT
ARG EFK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${EFK_VERSION}

# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>

COPY ./config/kibana.yml /usr/share/kibana/config/kibana.yml

ENTRYPOINT ["./bin/kibana", "--allow-root"]

EXPOSE ${KIBANA_PORT}