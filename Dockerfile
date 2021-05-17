FROM node:14-alpine
WORKDIR /usr/app
LABEL name "rent-a-nico service"

COPY package*.json tsconfig.json ./
RUN npm ci
COPY src src/
RUN npm run build
RUN npm prune --production

CMD [ "npm", "start" ]

