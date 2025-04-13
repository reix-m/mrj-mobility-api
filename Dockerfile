FROM node:20-alpine AS build

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
USER node
WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn --frozen-lockfile

COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts

RUN yarn build

FROM node:20-slim

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
USER node
WORKDIR /home/node/app

COPY --chown=node:node --from=build /home/node/app/dist ./dist
