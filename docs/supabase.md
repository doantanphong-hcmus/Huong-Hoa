# Kết nối Supabase cho frontend

Project Supabase đã được thiết lập. Mỗi thành viên trong team chỉ cần cấu hình frontend trên máy của mình:

1. Mở terminal tại thư mục gốc của repository và tạo file `client/.env` từ file mẫu:

   ```bash
   cd client
   cp .env.example .env
   ```

2. Mở `client/.env`, **thay toàn bộ nội dung mẫu** bằng nội dung file `.env` được gửi trong team và lưu lại. File cần có hai biến `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Chạy frontend bằng `npm run dev`. Nếu frontend đang chạy, dừng và chạy lại để Vite đọc file `.env` mới.

File `.env` đã nằm trong `.gitignore`; không commit file này lên repository.
