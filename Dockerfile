# Use a lightweight Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the backend
COPY backend/ ./

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
