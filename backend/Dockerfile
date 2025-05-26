FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]  # 또는 "dev", docker-compose에서 덮어쓰면 됨