FROM node:8-alpine

WORKDIR /app
COPY package.json ./

RUN npm install
RUN npm install -g supervisor
COPY . .


CMD supervisor app.js
