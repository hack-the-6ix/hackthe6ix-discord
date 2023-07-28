FROM node:18-alpine3.17
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=America/Toronto
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /local && touch /local/env
ENV HT6_ENV_SOURCE=/local/env

RUN apk add dumb-init

COPY package*.json .
RUN npm ci
COPY src src

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/bin/sh", "-c", "source $HT6_ENV_SOURCE && exec node ./src/index.js"]