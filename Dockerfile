# -----------------------------
# 1. Build Stage
# -----------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


# -----------------------------
# 2. Nginx Stage
# -----------------------------
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port for UI
EXPOSE 9001

# Use custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
