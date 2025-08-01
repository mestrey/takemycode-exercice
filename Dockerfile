FROM node:18-slim

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1234

CMD ["node", "index.js"]