# Dockerfile for the app service
FROM node:14

WORKDIR /app

COPY . .

CMD ["bash", "-c", "cd src/app && npm install && npm start "]
