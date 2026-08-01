FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pm2
 
COPY . .

EXPOSE 1111

CMD ["npm","start"]