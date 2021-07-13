FROM node:15

WORKDIR /app

COPY package.json ./

RUN yarn install;

RUN  yarn add tsc -g

COPY ./ ./

EXPOSE $PORT

