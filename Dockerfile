# Use an official Node.js runtime as the base image
FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon

COPY . .

CMD ["npm", "start"]