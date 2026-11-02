# Bếp Nhà Mình

Ứng dụng đặt món COD cho một cửa hàng, triển khai bằng React, Vite, Hono, Cloudflare Workers và D1 Database (lưu link ảnh trực tiếp, không cần R2).

## Cấu hình mặc định

- Tên cửa hàng: **Bếp Nhà Mình**.
- Phí giao hàng: **20.000 VND**.
- Chỉ giao hàng tận nơi, thanh toán COD.
- Ảnh món ăn: Lưu trực tiếp đường dẫn URL ảnh vào database Cloudflare D1 (không phụ thuộc R2).
- Múi giờ hiển thị: `Asia/Ho_Chi_Minh`.

Các giá trị cấu hình cửa hàng nằm trong `wrangler.jsonc`; có thể thay đổi trước khi chạy hoặc triển khai.

## Môi trường

- Node.js 22 trở lên và npm.
- Wrangler 4 được cài khóa trong dependencies; không cần cài global.
- Tài khoản Cloudflare chỉ cần khi tạo tài nguyên thật hoặc deploy.

## Cài và chạy local

```powershell
npm install
Copy-Item .dev.vars.example .dev.vars
npm run db:local
npm run dev
```

Vite chạy tại `http://localhost:5173`, Worker tại `http://localhost:8787`; Vite proxy `/api` tới Worker. Tạo secret local trước khi nhận đơn trong `.dev.vars` (file đã được Git ignore):

```powershell
TOKEN_SECRET=<chuoi-ngau-nhien-it-nhat-32-ky-tu>
ADMIN_BOOTSTRAP_SECRET=<chuoi-ngau-nhien-it-nhat-32-ky-tu>
PUBLIC_ORIGIN=http://localhost:5173
```

Có thể tạo chuỗi ngẫu nhiên bằng PowerShell:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Chạy kiểm tra bằng `npm run typecheck`, `npm run test`, `npm run build` và `npm audit`.

## Database và quản lý ảnh

`wrangler.jsonc` khai báo D1 `food-ordering`. D1 local được giả lập bởi Wrangler, không cần Cloudflare account. Món ăn được lưu trực tiếp link ảnh (URL) vào cột `image_url` trong D1. Bạn có thể dán bất kỳ link ảnh nào (Unsplash, Facebook, Imgur, hosting riêng, v.v.) ngay tại trang quản trị.

```powershell
npm run db:local
```

Không có tài khoản admin mặc định; bootstrap tài khoản theo hướng dẫn bên dưới.

## Bootstrap admin

Tạo secret riêng bằng lệnh PowerShell bên trên và nhập chúng vào `.dev.vars`; không để trống hai secret, không dùng giá trị ví dụ. Sau khi chạy app, gửi một lần request cùng secret header; thay giá trị prompt bằng secret local của bạn, không commit hoặc ghi nó vào script:

```powershell
$bootstrap = Read-Host "Bootstrap secret"
$password = Read-Host "Mat khau admin (it nhat 12 ky tu)"
$body = @{ username = "admin"; password = $password } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8787/api/admin/auth/bootstrap -Headers @{ "x-bootstrap-secret" = $bootstrap; Origin = "http://localhost:5173" } -ContentType "application/json" -Body $body
```

Bootstrap chỉ tạo user khi chưa có user nào và giới hạn request. Tạo tài khoản xong, xóa dòng `ADMIN_BOOTSTRAP_SECRET` khỏi `.dev.vars` rồi đăng nhập tại `/admin`. Mật khẩu tối thiểu 12 ký tự; không có mật khẩu admin mặc định.

## Tạo tài nguyên Cloudflare

Đăng nhập đúng tài khoản bằng `npx wrangler login`, sau đó tạo D1:

```powershell
npx wrangler d1 create food-ordering
```

Sao chép `database_id` Cloudflare trả về vào `wrangler.jsonc` thay cho `REPLACE_WITH_REAL_D1_DATABASE_ID`.

## Migration và secrets production

Chỉ chạy các bước sau sau khi đã xác nhận tài khoản, database ID và môi trường production:

```powershell
npx wrangler d1 migrations apply food-ordering --remote
npx wrangler secret put TOKEN_SECRET
npx wrangler secret put ADMIN_BOOTSTRAP_SECRET
npx wrangler secret put PUBLIC_ORIGIN
```

Wrangler sẽ yêu cầu nhập secret trực tiếp trong terminal. Dùng giá trị ngẫu nhiên riêng cho production; không tái sử dụng `.dev.vars`. Sau lần bootstrap admin production đầu tiên, gỡ `ADMIN_BOOTSTRAP_SECRET` bằng `npx wrangler secret delete ADMIN_BOOTSTRAP_SECRET`.

## Build và deploy

`npm run build` build frontend vào `apps/web/dist`; Wrangler phục vụ static assets và chuyển các route `/api/*` tới Worker.

```powershell
npm run build
npx wrangler deploy
```

Không chạy migration remote hoặc deploy nếu chưa kiểm tra lại Cloudflare account, D1 ID, domain và secrets. Health endpoint: `GET /api/health`.

## Cấu hình

- `wrangler.jsonc`: tên Worker, binding và biến không nhạy cảm `STORE_NAME`, `DELIVERY_FEE` (VND), `SESSION_TTL_HOURS`.
- Secrets Worker: `TOKEN_SECRET`, `ADMIN_BOOTSTRAP_SECRET`, `PUBLIC_ORIGIN`.
- Cửa hàng duy nhất, giao hàng tận nơi, COD; không tích hợp thanh toán online.
- Chatbot hỗ trợ khách hàng ngay trên trang chủ về thực đơn, giá món, phí giao hàng, COD, thời gian giao và theo dõi đơn; chatbot sử dụng dữ liệu thực đơn hiện có, không cần cấu hình dịch vụ AI bên ngoài.
- Các mốc thời gian lưu UTC; UI hiển thị `Asia/Ho_Chi_Minh`.

## Windows PowerShell

- Dùng `Copy-Item` để tạo `.dev.vars`; file này không được commit.
- D1 migration local của Wrangler có thể hỏi xác nhận tương tác. Chỉ xác nhận khi lệnh có cờ `--local` và tên D1 đúng.
- Nếu `npm` chặn script PowerShell, chạy `npm.cmd` với cùng tham số.
- Chạy local bằng `npm run dev`; frontend và Worker là hai tiến trình riêng.