FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN crontab /app/src/cron/snapshot-cleanup.crontab

EXPOSE 8001

CMD npm run dev

