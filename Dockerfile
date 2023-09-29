FROM node:18.16.0

WORKDIR /home/ubuntu/ipr

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm ci

COPY . .

EXPOSE 3005

CMD [ "npm", "run", "start:dev" ]
