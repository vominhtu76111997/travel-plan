# 🏔️ Plan Đà Lạt — Chia tiền & Lịch trình

Web app quản lý chuyến đi nhóm: chia tiền tự động theo đầu người, gợi ý chuyển khoản tối ưu, và lập kế hoạch (lưu trú, lịch trình, địa điểm, ẩm thực, đồ mang theo, checklist).

Logic tính tiền mô phỏng đúng file Google Sheet gốc: chi phí "Cả nhóm" chia đều theo đầu người + khoản riêng của từng cặp/người; đối chiếu tiền đã ứng vs phải trả để biết ai còn thiếu / được nhận lại.

## Chạy
Mở `index.html` bằng trình duyệt, hoặc chạy một web server tĩnh:

```bash
npx serve .
# hoặc
python -m http.server 5219
```

## Cấu trúc
- `index.html` — khung trang & các tab
- `app.js` — logic chia tiền + toàn bộ render
- `styles.css` — design system (glass UI, theme, animation)
- `travel.css` — style riêng cho phần du lịch
- `manifest.json` — PWA (cài lên màn hình chính)

## Lưu trữ dữ liệu
Hiện tại dữ liệu lưu trong **localStorage** của trình duyệt (mỗi thiết bị một bản riêng, chưa đồng bộ realtime). Xem phần "Kết nối Firebase" bên dưới nếu muốn nhiều người cùng chỉnh sửa realtime.
