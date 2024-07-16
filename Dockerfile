FROM node:latest
RUN cd /
RUN mkdir server
COPY ./ /server/
RUN cd /server/

ENTRYPOINT ["sh", "/server/run.sh"]
