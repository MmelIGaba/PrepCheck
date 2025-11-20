# Build the React app
<<<<<<< Updated upstream
FROM node:18-alpine AS builder
=======
FROM node:22-alpine AS builder
RUN npm rebuild esbuild

>>>>>>> Stashed changes
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom Nginx config (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
