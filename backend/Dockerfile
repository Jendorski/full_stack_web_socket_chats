FROM node:20-slim

WORKDIR /app

COPY shared /app/shared

COPY backend /app/backend

WORKDIR /app/backend
RUN npm install

RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]
