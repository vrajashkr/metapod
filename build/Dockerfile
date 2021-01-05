FROM alpine:latest

RUN apk add --no-cache --update yarn docker openrc
RUN rc-update add docker boot

EXPOSE 3000
EXPOSE 4000

COPY start.sh /scripts/start.sh

RUN ["chmod", "+x", "/scripts/start.sh"]
ENTRYPOINT ["/scripts/start.sh"]