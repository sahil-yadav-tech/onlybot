FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# CHANGED: Install only production dependencies
RUN npm ci --omit=dev

# Copy application
COPY . .

EXPOSE 1111

CMD ["npm", "start"]