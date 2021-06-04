ARG IMAGE_VER="14.16.0-alpine3.13"

FROM node:${IMAGE_VER} as build

COPY . /build

WORKDIR /build

#

FROM node:${IMAGE_VER}

RUN apk add --update --no-cache curl

COPY --from=build /build /app
COPY package.json package-lock.json /app/

WORKDIR /app

EXPOSE 3030
CMD ["npm", "run", "docker-start"]
