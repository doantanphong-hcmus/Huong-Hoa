# Hương Hỏa Frontend

Frontend React, TypeScript và Vite cho hệ thống Hương Hỏa.

## Chạy tại máy

```bash
npm ci
npm run dev
```

## Kiểm tra trước khi tích hợp

```bash
npm run check
```

Lệnh này kiểm tra TypeScript, ESLint, dữ liệu mẫu và production build.

## Docker

```bash
docker build -t huong-hoa-frontend .
docker run --rm -p 8080:80 huong-hoa-frontend
```

Mở `http://localhost:8080` để xem ứng dụng.
