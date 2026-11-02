# BÁO CÁO THUYẾT TRÌNH
## Ứng dụng đặt món trực tuyến “Bếp Nhà Mình”

**Thời lượng gợi ý:** 5–7 phút  
**Đối tượng:** Giảng viên, người nghe hoặc nhóm đánh giá dự án

---

## 1. Giới thiệu đề tài

“Bếp Nhà Mình” là ứng dụng web hỗ trợ cửa hàng kinh doanh món ăn Việt theo hình thức đặt món trực tuyến, giao tận nhà và thanh toán tiền mặt khi nhận hàng (COD). Ứng dụng gồm hai khu vực:

- **Khu vực khách hàng:** xem và tìm món, chọn món vào giỏ, đặt hàng và theo dõi trạng thái đơn.
- **Khu vực quản trị:** quản lý thực đơn, tiếp nhận và xử lý đơn hàng.

Phạm vi hiện tại tập trung vào mô hình **một cửa hàng**, giao hàng tận nơi và thanh toán COD. Ứng dụng chưa tích hợp thanh toán trực tuyến.

## 2. Mục tiêu

- Giúp khách đặt món và gửi thông tin giao hàng trực tuyến.
- Giúp cửa hàng quản lý món ăn, danh mục và đơn hàng ở một nơi.
- Tự động tính tiền dựa trên giá lưu trong hệ thống và phí giao hàng cấu hình.
- Cung cấp mã và thông tin xác thực riêng để khách theo dõi đơn.
- Xây dựng ứng dụng có thể chạy cục bộ và triển khai trên Cloudflare.

## 3. Đối tượng sử dụng

| Đối tượng | Nhu cầu | Chức năng chính |
|---|---|---|
| Khách hàng | Chọn món và đặt giao tận nhà | Xem/tìm món, quản lý giỏ, nhập thông tin, theo dõi đơn |
| Nhân viên | Tiếp nhận và xử lý đơn | Xem đơn, lọc/tìm đơn, xem thông tin chi tiết, cập nhật trạng thái |
| Quản trị viên | Quản lý hoạt động cửa hàng | Các chức năng xử lý đơn và quản lý món/danh mục; xác nhận đã thu COD |

## 4. Các chức năng chính

### 4.1. Dành cho khách hàng

- Hiển thị thực đơn theo danh mục.
- Tìm món theo tên hoặc mô tả.
- Xem tên món, mô tả, giá, hình ảnh và tình trạng còn phục vụ.
- Thêm món vào giỏ, tăng/giảm số lượng; giỏ hàng được lưu trên trình duyệt.
- Xem tạm tính, phí giao hàng và tổng tiền trước khi gửi đơn.
- Nhập họ tên, số điện thoại, địa chỉ và ghi chú cho quán.
- Đặt hàng với hình thức thanh toán COD.
- Theo dõi mã đơn, các món đã đặt, tổng tiền, trạng thái và tình trạng thanh toán.

### 4.2. Dành cho quản trị và nhân viên

- Đăng nhập khu vực quản trị.
- Tìm đơn theo mã, lọc theo trạng thái và khoảng ngày; xem tối đa 100 đơn gần nhất phù hợp.
- Xem chi tiết khách nhận hàng, địa chỉ, ghi chú và các món trong đơn.
- Cập nhật trạng thái theo quy trình hợp lệ:
  `Đã nhận đơn → Quán đã xác nhận → Đang chuẩn bị → Đang giao → Đã giao thành công`.
- Có thể hủy đơn ở các bước đầu theo quy tắc của hệ thống.
- Quản trị viên có thể xác nhận đã thu COD khi đơn đã hoàn tất.
- Quản lý danh mục: thêm, ẩn/hiện và sắp xếp thứ tự.
- Quản lý món: thêm, sửa, ẩn món, cập nhật giá, mô tả, hình ảnh bằng URL và tình trạng còn phục vụ.

## 5. Quy trình sử dụng

### Luồng đặt hàng

1. Khách mở trang chủ và xem thực đơn.
2. Khách lọc danh mục hoặc tìm món, sau đó thêm món vào giỏ.
3. Hệ thống hiển thị tạm tính, phí giao hàng và tổng tiền.
4. Khách nhập thông tin nhận hàng, kiểm tra đơn và xác nhận đặt.
5. Máy chủ kiểm tra dữ liệu, tình trạng món và tính lại giá từ cơ sở dữ liệu.
6. Đơn được lưu cùng các dòng món hàng; hệ thống trả mã đơn và mã theo dõi.
7. Khách xem trạng thái đơn; trang theo dõi tự làm mới dữ liệu định kỳ.
8. Nhân viên xử lý đơn trong trang quản trị; khách nhìn thấy trạng thái được cập nhật.

### Luồng quản lý thực đơn

1. Quản trị viên đăng nhập.
2. Thêm hoặc cập nhật danh mục và món ăn.
3. Có thể thay đổi giá, hình ảnh, mô tả và tình trạng phục vụ.
4. Thực đơn công khai được cập nhật từ dữ liệu trên máy chủ.

## 6. Kiến trúc và công nghệ

Ứng dụng được tổ chức theo dạng monorepo gồm frontend và API:

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Giao diện web | React 19, TypeScript, Vite | Hiển thị cửa hàng, giỏ hàng, đặt món, theo dõi và quản trị |
| Quản lý dữ liệu giao diện | TanStack Query | Tải và làm mới dữ liệu API |
| Kiểm tra dữ liệu | Zod | Kiểm tra dữ liệu nhập ở giao diện và API |
| API | Hono, TypeScript chạy trên Cloudflare Workers | Xử lý thực đơn, đơn hàng, xác thực và quản trị |
| Cơ sở dữ liệu | Cloudflare D1 (SQLite) | Lưu danh mục, món ăn, người dùng, phiên đăng nhập, đơn và chi tiết đơn |
| Triển khai | Cloudflare Workers và static assets | Phục vụ frontend và API trên cùng nền tảng |

**Mô hình xử lý:** Trình duyệt gọi các API `/api/...`; Worker xác thực và xử lý nghiệp vụ, sau đó đọc/ghi dữ liệu trong D1. Frontend được build bằng Vite và được Worker phục vụ cùng API.

## 7. Dữ liệu chính

- **Danh mục:** tên, slug, trạng thái hiển thị và thứ tự sắp xếp.
- **Món ăn:** danh mục, tên, mô tả, giá, URL hình ảnh và trạng thái còn phục vụ.
- **Tài khoản và phiên:** tên đăng nhập, mật khẩu đã băm, vai trò và thời hạn phiên.
- **Đơn hàng:** thông tin khách, địa chỉ, ghi chú, phí giao hàng, tổng tiền, phương thức/thanh toán và trạng thái.
- **Chi tiết đơn hàng:** tên món, đơn giá, số lượng và thành tiền tại thời điểm đặt.

Việc lưu bản chụp tên món và đơn giá trong chi tiết đơn giúp thông tin đơn cũ không phụ thuộc hoàn toàn vào các lần chỉnh sửa thực đơn sau này.

## 8. An toàn và tính tin cậy

- Dữ liệu đơn được kiểm tra ở API; máy chủ tự lấy giá từ cơ sở dữ liệu thay vì tin giá do trình duyệt gửi lên.
- Có giới hạn số lượng và tổng giá trị đơn hàng; món đã hết hoặc không còn hợp lệ sẽ bị từ chối.
- Có giới hạn tần suất cho các thao tác nhạy cảm và giới hạn kích thước dữ liệu gửi lên.
- Đơn hàng dùng khóa idempotency để hạn chế tạo trùng khi khách gửi lại cùng một yêu cầu.
- Mã theo dõi là một token bí mật riêng: cơ sở dữ liệu lưu bản băm để tra cứu và bản mã hóa để hỗ trợ yêu cầu thử lại.
- Mật khẩu quản trị được băm; phiên dùng cookie `HttpOnly`, có thời hạn, đồng thời các yêu cầu thay đổi dữ liệu được kiểm tra cùng nguồn.
- Tài khoản quản trị đầu tiên được khởi tạo bằng bootstrap secret; không có mật khẩu quản trị mặc định.
- Các truy vấn cơ sở dữ liệu sử dụng tham số ràng buộc; dữ liệu đầu vào được kiểm tra bằng schema.

## 9. Kiểm thử và triển khai

Kho mã có kiểm thử API cho các nhóm hành vi như tải danh mục/thực đơn, health check, tạo đơn COD, kiểm tra giá và số lượng, từ chối món không hợp lệ/hết hàng, giới hạn tổng tiền, chống gửi trùng và theo dõi bằng token. Dự án cũng có các lệnh kiểm tra kiểu, chạy test và build.

Quy trình triển khai ở mức tổng quát:

1. Cài dependencies và cấu hình các secret cần thiết.
2. Tạo hoặc cấu hình cơ sở dữ liệu D1.
3. Chạy migration để tạo/cập nhật cấu trúc dữ liệu.
4. Build frontend.
5. Deploy Worker và assets lên Cloudflare.
6. Khởi tạo tài khoản quản trị lần đầu và gỡ bootstrap secret sau khi dùng.

## 10. Phạm vi hiện tại và hướng phát triển

### Phạm vi hiện tại

- Một cửa hàng; chỉ giao hàng tận nơi.
- Chỉ hỗ trợ COD, chưa tích hợp cổng thanh toán.
- Hình ảnh món ăn được lưu dưới dạng URL, không tải lên dịch vụ lưu trữ ảnh riêng.
- Trang theo dõi dùng token được lưu trong phiên trình duyệt; đây không phải hệ thống thông báo đẩy.
- Trang quản trị hỗ trợ xử lý đơn và quản lý thực đơn theo vai trò hiện có.

### Hướng phát triển đề xuất

- Tích hợp thanh toán trực tuyến và đối soát giao dịch.
- Bổ sung quản lý khu vực giao hàng, phí theo khu vực và thời gian dự kiến.
- Thêm báo cáo doanh thu, số lượng món bán và thống kê theo thời gian.
- Bổ sung thông báo cho khách khi trạng thái đơn thay đổi.
- Nâng cấp quản lý tài khoản nhân viên và phân quyền chi tiết hơn.
- Tăng khả năng quản lý ảnh, ví dụ tải ảnh lên dịch vụ lưu trữ thay vì nhập URL.

## 11. Kết luận

“Bếp Nhà Mình” số hóa quy trình cơ bản từ xem thực đơn, đặt món, giao hàng đến xử lý đơn tại cửa hàng. Điểm nổi bật là có cả giao diện khách hàng và trang quản trị, tính tiền ở phía máy chủ, theo dõi trạng thái bằng token riêng và triển khai trên nền tảng Cloudflare. Đây là nền tảng phù hợp để tiếp tục mở rộng thêm thanh toán, báo cáo và các tính năng vận hành.

---

## Gợi ý lời thuyết trình

> Kính chào thầy cô và các bạn. Hôm nay nhóm em xin giới thiệu ứng dụng “Bếp Nhà Mình”, một website đặt món Việt giao tận nhà.  
>
> Ứng dụng giải quyết hai nhu cầu chính: khách hàng có thể xem thực đơn, chọn món, đặt hàng và theo dõi đơn; cửa hàng có thể quản lý món ăn, danh mục và cập nhật trạng thái đơn hàng. Quy trình thanh toán hiện tại là COD, phù hợp với phạm vi một cửa hàng và chưa cần tích hợp cổng thanh toán trực tuyến.  
>
> Về công nghệ, giao diện được xây dựng bằng React và TypeScript; API chạy trên Cloudflare Workers với Hono; dữ liệu được lưu trong Cloudflare D1. Khi khách đặt món, máy chủ kiểm tra thông tin, đối chiếu tình trạng món và tự tính lại giá từ dữ liệu trong cơ sở dữ liệu, sau đó tạo đơn cùng mã theo dõi.  
>
> Ứng dụng cũng có các biện pháp giúp tăng độ tin cậy như kiểm tra dữ liệu, giới hạn yêu cầu, chống tạo đơn trùng và bảo vệ thông tin xác thực theo dõi. Trong tương lai, hệ thống có thể mở rộng sang thanh toán trực tuyến, thống kê doanh thu và thông báo trạng thái.  
>
> Tóm lại, đây là một giải pháp đặt món có đủ luồng cơ bản cho khách hàng và cửa hàng, đồng thời có kiến trúc triển khai phù hợp để phát triển thêm. Em xin cảm ơn mọi người đã lắng nghe.

## Gợi ý demo khi thuyết trình

1. Mở trang chủ, giới thiệu thực đơn và thao tác tìm kiếm/lọc món.
2. Thêm món vào giỏ và chỉ ra cách tính tạm tính, phí giao hàng, tổng tiền.
3. Điền thông tin nhận hàng và đặt một đơn thử.
4. Mở trang theo dõi để trình bày mã đơn và trạng thái.
5. Đăng nhập quản trị, cập nhật trạng thái đơn và giới thiệu màn hình quản lý thực đơn.
