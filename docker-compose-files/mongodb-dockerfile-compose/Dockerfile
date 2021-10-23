FROM mongo:4

COPY .env .
RUN whoami
RUN export $(xargs /.env)
RUN printenv
RUN rm /.env

RUN echo ${ONLINE_MONGODB_URI} ${MONGODB_DATABASE};
RUN mongodump --uri ${ONLINE_MONGODB_URI}
RUN mongorestore  /dump/${ONLINE_MONGODB_DATABASE} -d ${ONLINE_MONGODB_DATABASE}
