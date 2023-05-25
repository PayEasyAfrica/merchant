FROM node:16.20-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn run build

FROM node:16.20-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY  --from=builder /usr/src/app/package.json ./package.json
COPY  --from=builder /usr/src/app/node_modules ./node_modules
COPY  --from=builder /usr/src/app/.next ./.next
COPY  --from=builder /usr/src/app/public ./public

EXPOSE 80

CMD [ "yarn", "next", "start", "-p", "80"]
