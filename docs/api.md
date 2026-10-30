# API Documentation

## Base URL

```text
http://localhost:3000
```

## Member endpoints

### GET /members

Lấy danh sách thành viên.

### GET /members/:id

Lấy thông tin thành viên theo ID.

### POST /members

Tạo mới thành viên.

Body mẫu:

```json
{
  "name": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0123456789"
}
```

### PATCH /members/:id

Cập nhật thông tin thành viên.

### DELETE /members/:id

Xoá thành viên.

## Response format

```json
{
  "success": true,
  "data": {}
}
```
