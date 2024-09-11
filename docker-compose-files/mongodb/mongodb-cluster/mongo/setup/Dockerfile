FROM mongo:4

COPY ./replica-set-configs.js /
COPY setup.sh /

ENTRYPOINT [ "/bin/bash" ]
CMD ["/setup.sh"]