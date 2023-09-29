FROM node:18.16.0

WORKDIR /home/ubuntu/ipr

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm ci

COPY . .

EXPOSE 6000

CMD [ "npm", "run", "start:dev" ]
