# Giai đoạn 1: Build ứng dụng
# Sử dụng một image Node.js phiên bản mới nhất (hoặc phiên bản bạn đang dùng)
FROM node:22-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép các file package.json và lock file vào trước
# Tận dụng cache của Docker, bước này chỉ chạy lại khi các file này thay đổi
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn còn lại của ứng dụng vào
COPY . .

# Build ứng dụng Next.js cho production
# Các biến môi trường NEXT_PUBLIC_* cần được cung cấp ở đây
# nếu chúng cần thiết trong quá trình build
RUN npm run build


# Giai đoạn 2: Chạy ứng dụng đã build
# Sử dụng một image nhỏ hơn để chạy, tối ưu kích thước
FROM node:20-alpine

WORKDIR /app

# Sao chép các file đã build từ giai đoạn 'builder'
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port 3000 mà Next.js sẽ chạy
EXPOSE 3000

# Lệnh để khởi động server Next.js production
CMD ["npm", "start"]