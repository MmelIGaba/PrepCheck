FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
