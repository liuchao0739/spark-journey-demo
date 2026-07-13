FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

RUN npx prisma db push && npx tsx prisma/seed.ts

EXPOSE 3000

CMD ["node", "dist/app.js"]
