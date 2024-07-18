FROM node:latest
RUN cd /
RUN mkdir server
COPY ./ /server/
RUN cd /server/

CMD ["sh", "/server/run.sh"]
