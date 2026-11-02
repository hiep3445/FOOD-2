# Hướng Dẫn Triển Khai Lên Cloudflare (Từ A Đến Z)

Tài liệu này hướng dẫn chi tiết từng bước đưa trang web đặt món **Bếp Nhà Mình** lên Cloudflare (sử dụng gói miễn phí, chỉ dùng **Cloudflare Workers** và **Cloudflare D1**, không cần R2).

---

## 📋 Danh Sách Chuẩn Bị
1. Một tài khoản [Cloudflare](https://dash.cloudflare.com/sign-up) (miễn phí).
2. Máy tính đã cài Node.js (khuyên dùng Node.js 20 hoặc 22+).
3. Đã chạy `npm install` trong thư mục dự án.

---

## 🚀 Các Bước Triển Khai

### Bước 1: Đăng nhập Cloudflare trên Terminal
Mở PowerShell (hoặc Terminal) tại thư mục `d:\FOOD`:

```powershell
npx wrangler login
```
Trình duyệt web sẽ tự động mở lên, bạn nhấn **Allow / Authorize** để cấp quyền cho Wrangler.

---

### Bước 2: Tạo Database D1 trên Cloudflare
Chạy lệnh tạo cơ sở dữ liệu:

```powershell
npx wrangler d1 create food-ordering
```

Sau khi chạy xong, terminal sẽ hiển thị thông tin tương tự như sau:
```text
[[d1_databases]]
binding = "DB"
database_name = "food-ordering"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

👉 Hãy **sao chép chuỗi `database_id`** này.

Mở file [`wrangler.jsonc`](file:///d:/FOOD/wrangler.jsonc), tìm dòng số 16:
```jsonc
"database_id": "REPLACE_WITH_REAL_D1_DATABASE_ID",
```
Thay `REPLACE_WITH_REAL_D1_DATABASE_ID` bằng chuỗi `database_id` bạn vừa copy.

---

### Bước 3: Chạy Migration tạo bảng dữ liệu trên Cloudflare
Đẩy cấu trúc bảng (danh mục, sản phẩm, đơn hàng, tài khoản) lên cloud:

```powershell
npm run db:remote
```
*(Nếu Wrangler hỏi `Are you sure you want to proceed? (y/n)`, gõ `y` rồi nhấn Enter).*

Lệnh này sẽ tự động nạp cả thực đơn 10 món Việt mẫu kèm link ảnh chất lượng cao vào database trên cloud.

---

### Bước 4: Tạo chuỗi bí mật và cài đặt Secrets
Bạn cần chuẩn bị 2 chuỗi ngẫu nhiên bảo mật (ít nhất 32 ký tự). Tạo nhanh bằng PowerShell:

```powershell
# Tạo chuỗi cho TOKEN_SECRET
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Tạo chuỗi cho ADMIN_BOOTSTRAP_SECRET
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Bây giờ đẩy các secret lên Cloudflare Worker:

1. **TOKEN_SECRET** (dùng mã hóa phiên đăng nhập & mã đơn hàng):
   ```powershell
   npx wrangler secret put TOKEN_SECRET
   ```
   *(Dán chuỗi ngẫu nhiên thứ nhất vào terminal rồi Enter)*

2. **ADMIN_BOOTSTRAP_SECRET** (khoá bí mật dùng để khởi tạo tài khoản admin lần đầu):
   ```powershell
   npx wrangler secret put ADMIN_BOOTSTRAP_SECRET
   ```
   *(Dán chuỗi ngẫu nhiên thứ hai vào terminal rồi Enter - hãy lưu lại chuỗi này vào Notepad để dùng ở Bước 6)*

3. **PUBLIC_ORIGIN** (tên miền trang web của bạn):
   Tên miền mặc định của Worker có dạng `https://food-ordering.<subdomain-cua-ban>.workers.dev`.
   Nếu bạn chưa rõ subdomain của mình, bạn có thể deploy trước ở Bước 5 để lấy link, rồi quay lại đặt biến này:
   ```powershell
   npx wrangler secret put PUBLIC_ORIGIN
   ```
   *(Nhập link domain đầy đủ, ví dụ: `https://food-ordering.ten-ban.workers.dev` không có dấu gạch chéo `/` ở cuối)*

---

### Bước 5: Build và Triển Khai (Deploy)
Chạy lệnh đóng gói và deploy toàn bộ:

```powershell
npm run deploy
```

Lệnh này sẽ:
1. Tự động biên dịch code frontend (React/Vite) vào thư mục `apps/web/dist`.
2. Đẩy Worker API và toàn bộ giao diện lên hạ tầng Cloudflare toàn cầu.

Sau khi hoàn tất, terminal sẽ in ra đường link trang web của bạn, ví dụ:
```text
https://food-ordering.username.workers.dev
```

---

### Bước 6: Khởi Tạo Tài Khoản Quản Trị (Bootstrap Admin)
Vì trang web mới chưa có tài khoản nào, bạn cần gửi một yêu cầu để kích hoạt tài khoản Admin ban đầu.

Mở PowerShell và chạy đoạn script sau (hãy thay URL thật và secret bạn đã lưu ở Bước 4):

```powershell
$domain = "https://food-ordering.username.workers.dev" # Thay bằng URL trang của bạn
$bootstrapSecret = "CHUOI_ADMIN_BOOTSTRAP_SECRET_CUA_BAN"
$adminPassword = "MatKhauAdminRatManh123@" # Tối thiểu 12 ký tự

$body = @{
    username = "admin"
    password = $adminPassword
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
    -Uri "$domain/api/admin/auth/bootstrap" `
    -Headers @{
        "x-bootstrap-secret" = $bootstrapSecret
        "Origin" = $domain
    } `
    -ContentType "application/json" `
    -Body $body
```

Khi nhận được phản hồi thành công (`status 201`), tài khoản admin của bạn đã được tạo!

---

### Bước 7: Dọn Dẹp Khóa Bảo Mật
Sau khi đã tạo xong admin, hãy xóa ngay khóa `ADMIN_BOOTSTRAP_SECRET` khỏi Cloudflare để không ai có thể tạo thêm tài khoản quản trị:

```powershell
npx wrangler secret delete ADMIN_BOOTSTRAP_SECRET
```
*(Gõ `y` để xác nhận)*

---

### Bước 8: Đăng Nhập & Quản Lý Thực Đơn
1. Truy cập vào trang quản trị:
   ```text
   https://food-ordering.username.workers.dev/admin
   ```
2. Đăng nhập với:
   - **Tên đăng nhập:** `admin`
   - **Mật khẩu:** Mật khẩu bạn đã đặt ở Bước 6.
3. Trong trang quản trị, bạn có thể:
   - Thêm danh mục món ăn mới.
   - Thêm/sửa món ăn, đổi giá, mô tả.
   - **Dán trực tiếp link ảnh** từ bất kỳ đâu (Unsplash, Facebook, Google Drive công khai, Imgur, v.v.) và xem trước ảnh ngay lập tức.
   - Theo dõi và cập nhật trạng thái đơn hàng khi khách đặt.

---

## ❓ Xử Lý Lỗi Thường Gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `Database not found` hoặc lỗi ID | Chưa thay `REPLACE_WITH_REAL_D1_DATABASE_ID` | Mở `wrangler.jsonc` và điền ID lấy từ lệnh `npx wrangler d1 create food-ordering`. |
| `Origin not allowed` (403) khi đặt hàng/đăng nhập | Biến `PUBLIC_ORIGIN` sai | Chạy lại `npx wrangler secret put PUBLIC_ORIGIN` và điền đúng URL trang web (phải khớp chính xác giao thức `https://` và không có `/` ở cuối). |
| `no such table: products` (500) | Chưa chạy migration trên cloud | Chạy lại lệnh: `npm run db:remote`. |
