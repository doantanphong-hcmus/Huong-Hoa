# Dự án SE - Quản lý thành viên trong gia đình 

## Mục tiêu dự án

Dự án này xây dựng một hệ thống quản lý thành viên trong gia đình với kiến trúc tách biệt giữa frontend và backend:

- Frontend: React + Vite
- Backend: NestJS
- Database: PostgreSQL + TypeORM (dự kiến)
- Tài liệu: lưu trong thư mục docs

Mục tiêu chính là xây dựng một ứng dụng có thể:

- hiển thị danh sách thành viên 
- thêm, sửa, xoá thành viên
- gọi API từ frontend đến backend
- quản lý dữ liệu rõ ràng, mở rộng dễ dàng

## Công nghệ sử dụng

### Frontend

- React
- Vite
- TypeScript
- Axios

### Backend

- NestJS
- TypeScript
- TypeORM
- PostgreSQL

## Cấu trúc thư mục

```text
Đồ án 1/
├── client/                  # frontend React
├── Server/                  # backend NestJS
├── docs/                    # tài liệu dự án
├── .gitignore               # ignore file chung
├── README.md                # tài liệu chính
├── package.json             # cấu hình root (nếu cần)
└── package-lock.json
```

## Hướng dẫn chạy dự án

### 1. Cài đặt dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd Server
npm install
```

### 2. Chạy frontend

```bash
cd client
npm run dev
```

Frontend sẽ chạy ở địa chỉ mặc định của Vite, thường là:

```text
http://localhost:5173
```

### 3. Chạy backend

```bash
cd Server
npm run start:dev
```

Backend thường chạy ở:

```text
http://localhost:3000
```

## Tài liệu phụ

Các tài liệu bổ sung đã được lưu trong thư mục [docs](docs):

- [docs/README.md](docs/README.md)
- [docs/requirements.md](docs/requirements.md)
- [docs/api.md](docs/api.md)
- [docs/notes.md](docs/notes.md)

## Quy trình phát triển

1. Thiết kế API và dữ liệu
2. Xây dựng backend NestJS
3. Tạo entity, DTO, service, controller
4. Kết nối frontend với API
5. Kiểm thử và sửa lỗi
6. Cập nhật tài liệu

## Lưu ý

- Không commit các file nhạy cảm như `.env`
- Không commit file hệ thống của macOS như `.DS_Store`
- Không lưu dữ liệu nhạy cảm vào mã nguồn
- Luôn cập nhật tài liệu khi thêm chức năng mới

## Ghi chú

Dự án đang ở giai đoạn boilerplate và chuẩn bị phát triển các module thực tế như quản lý thành viên, API CRUD, và giao diện tương tác với backend.
