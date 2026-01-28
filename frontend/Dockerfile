# Build stage
FROM node:20-slim AS build

# Copy shared types
COPY shared /app/shared

# Copy frontend
COPY frontend /app/frontend

# Install dependencies in frontend
WORKDIR /app/frontend
RUN npm install

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
