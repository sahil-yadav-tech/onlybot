FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g pm2

COPY . .

EXPOSE 1111

CMD ["pm2-runtime", "ecosystem.config.cjs"]