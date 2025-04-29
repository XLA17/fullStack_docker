FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    nodejs \
    npm \
    mysql-client \
    && apt-get clean

COPY package*.json ./
RUN npm install express mysql2 bcrypt jsonwebtoken cors body-parser

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]