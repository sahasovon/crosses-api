# create a file named Dockerfile
FROM node:8-alpine
RUN mkdir /app
WORKDIR /app

EXPOSE 3000

## WAIT FOR IT
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start
