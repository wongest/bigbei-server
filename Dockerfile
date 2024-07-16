FROM node:latest
RUN cd /
RUN mkdir server
COPY ./ /server/
RUN cd /server/bigbei-server

ENTRYPOINT ["npm", "serve"]
