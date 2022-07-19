FROM node:alpine

WORKDIR /app

COPY package.json .
RUN yarn config set "strict-ssl" false
RUN yarn install

COPY . .

CMD [ "yarn", "start" ]

