ARG EFK_VERSION

FROM docker.elastic.co/beats/filebeat:${EFK_VERSION}

USER root

COPY ./config/filebeat.yml /usr/share/filebeat/
RUN chown root. /usr/share/filebeat/filebeat.yml
RUN chmod go-w /usr/share/filebeat/filebeat.yml
