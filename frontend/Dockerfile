FROM node:22-bullseye AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm uninstall esbuild && npm install esbuild
COPY . .

# Build the app
RUN npm run build

EXPOSE 5173

# Run preview server from /app/dist
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
