ARG IMAGE_VER="14.16.0-alpine3.13"

FROM node:${IMAGE_VER} as build

RUN npm run translation:generate

COPY . /build

WORKDIR /build

RUN npm run build

#

FROM node:${IMAGE_VER}

RUN apk add --update --no-cache curl

COPY --from=build /build /app
COPY package.json package-lock.json /app/

WORKDIR /app

EXPOSE 3030
CMD ["npm", "run", "docker-start"]
