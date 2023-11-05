# First stage: Install dependencies
FROM node:18.17-alpine as deps

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "index.js"]