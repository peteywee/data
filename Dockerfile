FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm i --quiet || true
COPY . .
RUN npm run build
CMD ["node","dist/index.js"]
