FROM node:14.15-alpine

WORKDIR /movies

COPY ./package.json ./package-lock.json ./
RUN npm install --only=prod

RUN mkdir ./src
COPY ./src ./src

CMD ["npm", "start"]