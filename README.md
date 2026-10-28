# Pharmesthetic Homecare

Trang bán hàng một trang cho khách lẻ của GIVEHADA. Khách chọn sản phẩm, gửi form đặt hàng, đơn đổ về Google Sheet và email báo về givehada@h2yjsc.com. Chuyên viên gọi xác nhận.

Link: https://langdingpage-theta.vercel.app. Mỗi lần đẩy code lên nhánh main, Vercel tự dựng lại trang.

## Sửa nội dung

| Muốn sửa | Mở file |
|---|---|
| Giá niêm yết, giá giảm | Google Sheet “GIVEHADA Homecare \| Đơn web”, tab **Bảng giá** |
| Tên, quy cách, mô tả, ảnh sản phẩm | `content/products.json` |
| Thêm hoặc bỏ sản phẩm khỏi trang | `content/products.json`, mảng `products` |
| Ba sản phẩm chủ lực, liệu trình gợi ý, chữ trên trang | `content/site.json` |
| Địa chỉ nhận đơn (URL Apps Script) | `content/site.json`, mục `order.endpoint` |

Ảnh sản phẩm lấy theo đường dẫn trên cdn.givehada.com, phần sau `media/images/`. Mỗi lần deploy, Vercel tải ảnh về, nén sang WebP nhiều cỡ.

## Giá bán

Giá quản lý trên tab **Bảng giá**: cột D Giá niêm yết, cột E Giá giảm, cột F tự tính mức giảm (tô đỏ khi giảm quá 50%). Ô Giá giảm để trống, hoặc không thấp hơn giá niêm yết, thì bán theo giá niêm yết.

Có giá giảm, trang hiện giá giảm, giá niêm yết gạch ngang và mức giảm ở thẻ sản phẩm, trang chi tiết, liệu trình và đơn hàng. Sửa giá trên sheet, khoảng 1 đến 2 phút sau trang cập nhật (Apps Script giữ bảng giá 60 giây, `api/prices.js` giữ thêm 60 giây ở CDN của Vercel). Đơn luôn tính tiền theo tab này, không theo giá trình duyệt gửi lên. Giá trong `content/products.json` chỉ dùng khi không đọc được sheet.

## Nhận đơn

Mã nhận đơn nằm ở `apps-script/Code.gs`, chạy trên Google Apps Script của tài khoản khuongnvm@h2yjsc.com:

1. Mở sheet "GIVEHADA Homecare | Đơn web", chọn Tiện ích mở rộng, Apps Script.
2. Dán toàn bộ `Code.gs`, lưu.
3. Chạy hàm `testNotify` một lần để cấp quyền, kiểm tra hộp thư nhận email thử.
4. Triển khai, Tùy chọn triển khai mới, loại Ứng dụng web, thực thi với tư cách Tôi, quyền truy cập Bất kỳ ai.
5. Dán URL ứng dụng web vào `order.endpoint` rồi đẩy code.

Sửa mã sau này: dán đè `Code.gs`, Lưu, rồi Triển khai, Quản lý triển khai, biểu tượng bút chì, Phiên bản mới, Triển khai. URL giữ nguyên.

Mỗi đơn ghi một dòng vào tab **Đơn hàng**: thời gian, mã đơn, khách, sản phẩm, tạm tính, ghi chú, nguồn quảng cáo (utm), trạng thái để CS cập nhật.

## Chạy thử ở máy

```
npm install
npm run build:offline   # ảnh giả, không cần mạng
npx serve dist
npm run build:single    # một file dist-preview/index.html để gửi xem trước, ảnh lấy thẳng từ cdn.givehada.com
```
