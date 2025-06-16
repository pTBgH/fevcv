# === Stage 1: The Builder ===
# Không cần ARG ở đây nữa
FROM node:22-alpine AS build_image

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
# Biến môi trường public (nếu có) có thể được truyền vào lúc build
# RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npm run build
# Nhưng thường thì Next.js sẽ tự lấy từ môi trường lúc chạy nên không cần
RUN npm run build

# === Stage 2: The Runner ===
FROM node:22-alpine

WORKDIR /app

# Biến này rất quan trọng cho image production
ENV NODE_ENV=production

COPY --from=build_image /app/package.json ./package.json
COPY --from=build_image /app/package-lock.json ./package-lock.json
RUN npm install --only=production --frozen-lockfile

COPY --from=build_image /app/.next ./.next
COPY --from=build_image /app/public ./public

EXPOSE 3000

USER node

CMD ["npm", "start"]