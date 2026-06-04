FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
