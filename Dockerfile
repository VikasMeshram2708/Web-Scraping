FROM node:slim

WORKDIR /bharat-buzz-feed-backend

COPY . .

RUN npm install

EXPOSE 5001

CMD ["npm", "start"]