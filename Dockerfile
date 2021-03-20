FROM node:14
WORKDIR /app
COPY . /app
RUN npm run auto-install
EXPOSE 3030
CMD ["npm", "start"]
