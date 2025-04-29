FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    npm \
    && apt-get clean

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
