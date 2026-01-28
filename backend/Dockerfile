# Use node 20
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy shared types
COPY shared /app/shared

# Copy backend
COPY backend /app/backend

# Install dependencies in backend
WORKDIR /app/backend
RUN npm install

# Build the backend (using tsc)
RUN npm run build

# Expose the WS port
EXPOSE 8081

# Start the server
CMD ["npm", "start"]
