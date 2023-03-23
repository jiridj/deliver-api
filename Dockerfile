FROM node:16-bullseye-slim

ENV DELIVER_API_PORT=3333
ENV DELIVER_API_SECRET_KEY=s3cr3t
ENV MONGODB_HOST=mongo-db
ENV MONGODB_PORT=27017
ENV MONGODB_DATABASE=deliver
ENV MONGODB_USERNAME=deliver-api
ENV MONGODB_PASSWORD=s3cr3t

ENV NODE_ENV=production

WORKDIR /app
#RUN npm install -g npm

COPY . /app
RUN npm install

CMD ["node", "index.js"]