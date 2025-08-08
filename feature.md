Hệ thống camera

### 1.Quản lý Camera
- Thêm / sửa / xóa camera
- Gán thông tin như tên, vị trí, IP, loại camera, độ phân giải, FPS

### 2.Truyền phát video (Streaming)
- Xem video trực tiếp từ camera (qua WebSocket, RTSP → JSMpeg)
- Bắt đầu / dừng stream theo yêu cầu
- snapshot screen 

### 3.Kiểm tra trạng thái (Health Check)
- Kiểm tra online/offline/lỗi theo thời gian thực
- Đo độ trễ phản hồi (ping ms)
- Cảnh báo nếu camera offline
- Lưu log và lịch sử trạng thái

### 4.Phân quyền người dùng
- Phân quyền: Admin (toàn quyền), Viewer (chỉ xem, thêm camera)

### 5.Báo cáo & Thống kê
- Tỷ lệ online/offline


```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Frontend      │◄──────────────►│   Backend       │
│   (React)       │                 │  (Spring Boot)  │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
     JSMpeg Player                      FFmpeg Process
         │                                   │
         ▼                                   ▼
┌─────────────────┐    RTSP Stream   ┌─────────────────┐
│   Video Canvas  │◄──────────────►│   RTSP Camera   │
│   (HTML5)       │                 │   (Hardware)    │
└─────────────────┘                 └─────────────────┘
```