FROM node:16-alpine3.12
RUN apk -U upgrade && apk add --no-cache --virtual .persistent-deps \
    curl \
    openssl
WORKDIR /home/node
COPY package*.json ./
RUN npm install --no-save
COPY src ./src
RUN chown -R node:node .
ENV NODE_ENV production
CMD ["node", "src/index.js"]