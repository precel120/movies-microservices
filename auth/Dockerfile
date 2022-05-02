FROM node:14.15-alpine

WORKDIR /auth

COPY ./package.json ./package-lock.json ./
RUN npm install --only=prod

RUN mkdir ./src
COPY ./src ./src

CMD ["node", "./src/server.js"]