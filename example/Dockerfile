FROM node:current-alpine

ARG PORT=8080

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm i --production --ignore-scripts=false --arch=x64 --platform=linux

COPY --chown=node:node . .

EXPOSE ${PORT}

ENV PORT=${PORT}

CMD [ "npm", "run", "server" ]
