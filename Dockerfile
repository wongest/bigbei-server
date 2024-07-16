FROM node:latest
RUN cd /
RUN mkdir server
COPY ./ /server/
RUN cd /server

ENTRYPOINT ["node", "serve"]
