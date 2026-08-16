FROM node:24 AS build

WORKDIR /src

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production=true

FROM node:24-alpine AS deploy

WORKDIR /app

COPY --from=build /src/dist/ /app
COPY --from=build /src/node_modules ./node_modules

ENTRYPOINT [ "node", "main.js" ]
