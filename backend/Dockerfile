FROM node:19-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "migration-config.json", "./"]

RUN npm install

CMD npm run dev