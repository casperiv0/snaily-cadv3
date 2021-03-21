FROM node:14.16.0-alpine3.13 as build

COPY . /build

WORKDIR /build

RUN npm run auto-install

#

FROM node:14.16.0-alpine3.13

COPY --from=build /build/client/ /app/client
COPY --from=build /build/server/ /app/server
COPY package.json package-lock.json /app/

COPY server/config.example.ts /app/server/config.ts

WORKDIR /app

EXPOSE 3030
CMD ["npm", "start"]
