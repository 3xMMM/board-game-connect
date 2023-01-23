FROM node:19-alpine

WORKDIR /app

COPY ["package*.json", "tsconfig.json", "migration-config.json", "./"]

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

CMD npm run dev