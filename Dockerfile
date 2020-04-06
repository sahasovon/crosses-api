# create a file named Dockerfile
FROM node:8-alpine
RUN mkdir /app
WORKDIR /app
CMD ["npm", "start"]
