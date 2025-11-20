# backend/Dockerfile

# Use a lightweight Node.js base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the backend source code
COPY . .

# Expose the backend port (matches server.js PORT = 5000)
EXPOSE 5000

# Define environment variable
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
