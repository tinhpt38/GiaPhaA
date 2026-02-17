# Hướng dẫn Cấu hình Google Authentication

Bạn cần thực hiện các bước này trên trình duyệt (Supabase Dashboard & Google Cloud Console), không phải trong code.

## 1. Lấy Callback URL từ Supabase
1.  Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2.  Chọn Project của bạn -> menu **Authentication** (icon ổ khóa) -> **Providers**.
3.  Chọn **Google**.
4.  Copy dòng **Callback URL** (ví dụ: `https://vtw...supabase.co/auth/v1/callback`).

## 2. Tạo Google Cloud Project & Credentials
1.  Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2.  Tạo Project mới.
3.  Tìm **OAuth consent screen** -> Chọn **External** -> Điền thông tin cơ bản (App name, Email).
4.  Vào menu **Credentials** -> **Create Credentials** -> **OAuth client ID**.
5.  Chọn **Web application**.
6.  Ở mục **Authorized redirect URIs**, nhấn **Add URI** và dán 2 link sau:
    -   Link Callback URL copy từ Supabase (ở bước 1).
    -   `http://localhost:3000/auth/callback` (để chạy dưới local).
7.  Nhấn **Create**.
8.  Copy **Client ID** và **Client Secret**.

## 3. Nhập thông tin vào Supabase
1.  Quay lại Supabase (Authentication > Providers > Google).
2.  Dán **Client ID** vào ô tương ứng.
3.  Dán **Client Secret** vào ô tương ứng.
4.  Bật switch **Enable Sign in with Google**.
5.  Nhấn **Save**.

## 4. Cấu hình Redirect URL Local trong Supabase
1.  Tại Supabase, vào menu **Authentication** -> **URL Configuration**.
2.  Ở mục **Redirect URLs**, thêm: `http://localhost:3000/auth/callback`.
3.  Nhấn **Save**.

Sau khi hoàn tất, file `.env.local` của bạn cần có đúng `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Khởi động lại dự án (`npm run dev`) và thử đăng nhập.
