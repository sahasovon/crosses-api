# create a file named Dockerfile
FROM node:8-alpine
WORKDIR /app

CMD ["npm", "test"]
