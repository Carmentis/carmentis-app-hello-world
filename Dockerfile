FROM node:20

WORKDIR /app
COPY . .

EXPOSE 8000

RUN npm install --save



CMD node app.mjs