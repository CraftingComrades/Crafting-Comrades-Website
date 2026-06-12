FROM node:alpine

ENV NODE_ENV=development

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm i --dangerously-allow-all-builds

COPY . .

ENV NODE_ENV=production

RUN pnpm run build

FROM node:slim

WORKDIR /app

COPY --from=0 /app .

COPY . .

EXPOSE 3000

CMD ["node", "./build"]
