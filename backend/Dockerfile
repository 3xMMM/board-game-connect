#FROM node:19-alpine
#
#WORKDIR /app
#
#COPY package.json .
#
#RUN npm install
#
#COPY . .
#
#EXPOSE 4000
#
#CMD ["node", "app.ts"]

FROM node:19-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]

RUN npm install

CMD npm run dev