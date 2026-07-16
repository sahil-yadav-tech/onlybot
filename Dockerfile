FROM node:22-alpine
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production  # or just npm ci if you need dev dependencies

# Copy source code
COPY . .

# Build if needed (e.g., TypeScript, React, etc.)
# RUN npm run build

EXPOSE 1111
CMD ["npm", "start"]