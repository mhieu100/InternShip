Ứng dụng này là một hệ thống quản lý kệ hàng thông minh (Smart Shelf Management System) cho cửa hàng bán lẻ, với các chức năng chính:

- Theo dõi tình trạng hàng hóa trên kệ (OSA - On Shelf Availability)

- Quản lý cảnh báo khi hàng hóa sắp hết

- Phân tích lưu lượng khách hàng tại các kệ

- Báo cáo hiệu suất hàng ngày

```

1. Giám sát thời gian thực:

Dữ liệu từ shelf_metrics được cập nhật liên tục

So sánh osa_rate với threshold trong shelf_alert_thresholds để kích hoạt cảnh báo

2. Báo cáo hàng ngày:

Tổng hợp từ shelf_metrics vào shelf_summary_daily cuối ngày

Tính toán các chỉ số như shortage_rate, alert_count

3 .Phân tích khách hàng:

Kết hợp customer_visits với shelf_metrics để phân tích:

- Mối quan hệ giữa lưu lượng khách và tình trạng kệ

- Thời gian tương tác trung bình tại các kệ