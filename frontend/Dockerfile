# --- Stage 1: Build the React app ---
FROM node:18 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the static assets
RUN npm run build

# --- Stage 2: Serve the static assets with Nginx ---
FROM nginx:alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 by default
EXPOSE 80

# Default command starts Nginx, no CMD needed
