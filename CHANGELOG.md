# Nhật ký thay đổi (Changelog)

Cập nhật các tính năng và sửa lỗi mới nhất của nền tảng Gia Phả Việt.

## [Phiên bản Mới Nhất] - 25/02/2026
### ✨ Tính năng mới (Added)
- **Thẩm mỹ gia phả (Builder Design):** Áp dụng phong cách thiết kế cung đình "Luxury" bằng hệ thống nền ảnh SVG mới cùng các đường liên kết đính kèm các khuyên ngọc tròn mảnh mai màu vàng ánh kim (metallic gold).
- **Viền thành viên sinh động (Custom SVG Borders):** Viền thẻ người dùng được thiết kế riêng biệt và tự động thích ứng với trạng thái sống (bo tròn viền 2 bên) / mất (màu đặc biệt và gắn đủ 4 hoa văn vuông góc). Đổi màu nền của người khuất thành vàng nhạt (Pastel) để thống nhất tone bộ khung UI.

## [Bản Cập Nhật Trước] - 24/02/2026
### ✨ Tính năng mới (Added)
- Bổ sung tùy chọn Tải gia phả tự động bằng các loại hình: File sơ đồ sắc nét (PDF), Danh sách (Excel) và dữ liệu thô (JSON).
- Thêm Bảng hướng dẫn hỗ trợ di chuyển (Pan, Zoom) và chọn nhóm (Shift + Drag) nổi ngay bên trong khung biên tập cây gia phả.
- Nâng cấp độ sắc nét của chức năng Xuất bản hình ảnh.
- Tích hợp hộp thoại Xác nhận (Alert Dialog) khi người dùng chủ động bật tuỳ chọn "Công khai Gia phả" nhằm đảm bảo tính chủ động để tránh trường hợp rò rỉ dữ liệu ngoài ý muốn.
- Thêm các văn bản điều khoản hệ thống: Điều khoản Dịch vụ và Chính sách Bảo mật (Terms/Privacy).
- Bổ sung trang quản lý tập trung Nhật ký thay đổi (Changelog).

### 🐛 Sửa lỗi (Fixed)
- Sửa lỗi ngớ ngẩn (Redirect Loop) ngăn bản thân người dùng quay lại Dashboard hoặc trang chủ khi thay đổi phiên đăng nhập.
- Hiển thị chính xác màu giới tính (Icon đại diện, Nhãn tên) tại trang Chi tiết Gia phả, dựa trên chuỗi chuỗi dữ liệu đầu vào.
- Sửa lại các Policy của RLS Row Level Security nhằm ngăn chặn vấn đề thất thoát dữ liệu.
