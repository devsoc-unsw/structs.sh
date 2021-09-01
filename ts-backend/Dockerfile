FROM node:14.17.2-alpine
WORKDIR /ts-backend
COPY . . 
RUN yarn install --production
EXPOSE 3000
CMD yarn start
