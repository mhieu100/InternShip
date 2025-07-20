# 🛡️ Camera Service – Supermarket Surveillance System

## 📖 Mô tả

**Camera Service** là một microservice thuộc hệ thống giám sát siêu thị, chịu trách nhiệm **quản lý thông tin camera**, **giám sát trạng thái**, và **cung cấp luồng stream video** từ camera IP thông qua RTSP → HLS.

---

## 🚀 Chức năng chính

- Quản lý danh sách camera (tên, IP, vị trí, độ phân giải, FPS…)
- Cung cấp luồng stream video camera qua HLS
- Xem chi tiết camera và lịch sử trạng thái
- Cung cấp REST API để frontend hoặc các service khác tích hợp
- Realtime stream qua `HLS` (WebRTC sẽ được cân nhắc sau)

---

## 🧱 Kiến trúc tổng quan

```
Camera IP (RTSP)
   ↓
FFmpeg hoặc RTSPtoWeb
   ↓
Stream HLS (.m3u8)
   ↓
Frontend (React) + HLS.js
```

> Ghi chú: Camera Service **không xử lý xác thực**. Các request đến đây nên đã được xác thực và phân quyền bởi **Authentication Service / API Gateway**.

---

## 🧑‍💻 Công nghệ sử dụng

| Thành phần        | Công nghệ                        |
| ----------------- | -------------------------------- |
| Ngôn ngữ          | Java 17                          |
| Framework         | Spring Boot 3.x                  |
| Database          | MySQL hoặc PostgreSQL            |
| Video Streaming   | FFmpeg hoặc RTSPtoWeb            |
| API               | RESTful                          |
| Frontend (client) | React + HLS.js (truy cập stream) |

---

## 🧩 Cấu trúc cơ sở dữ liệu

### Bảng: `camera`

| Trường         | Kiểu dữ liệu | Mô tả                        |
| -------------- | ------------ | ---------------------------- |
| `id`           | UUID / Long  | Mã định danh camera          |
| `name`         | String       | Tên camera                   |
| `ip_address`   | String       | IP camera (cho RTSP)         |
| `location`     | String       | Vị trí camera trong siêu thị |
| `resolution`   | String       | e.g., `1920x1080`            |
| `fps`          | Integer      | Frames per second            |
| `status`       | Enum         | `ACTIVE`, `OFFLINE`, `ERROR` |
| `last_updated` | Timestamp    | Lần cập nhật cuối            |

---

## 🌐 REST API

### 🔹 Lấy danh sách camera

```
GET /api/cameras
```

### 🔹 Lấy chi tiết camera

```
GET /api/cameras/{id}
```

### 🔹 Lấy URL stream HLS

```
GET /api/cameras/{id}/stream-url
```

📌 Trả về đường dẫn tới file `.m3u8` đã được xử lý từ RTSP.

---

## 🎥 Tích hợp stream với FFmpeg

### Mẫu lệnh FFmpeg chuyển RTSP → HLS

```bash
ffmpeg -i rtsp://<ip>/stream1 \
       -c:v copy -f hls -hls_time 2 \
       -hls_list_size 3 -hls_flags delete_segments \
       ./hls/camera_{id}.m3u8
```

- File `.m3u8` có thể được phục vụ qua Spring Boot hoặc Nginx.

---

## 🖥️ Tích hợp frontend (React)

### Dùng `HLS.js` để phát stream

```jsx
import Hls from "hls.js";

function CameraPlayer({ streamUrl }) {
  const videoRef = useRef();
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    } else {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return <video ref={videoRef} controls autoPlay />;
}
```

---

## 🔐 Xác thực & bảo mật

- Các API của Camera Service **không trực tiếp xử lý xác thực**.
- Tích hợp thông qua Gateway (API Gateway hoặc Authentication Service riêng).
- Đường dẫn tới stream nên được bảo vệ và expire sau thời gian nhất định (JWT, signed URL, etc.).

---

## 📦 TODO / Future Plan

- [ ] Tích hợp WebRTC stream (latency thấp hơn)
- [ ] Gửi cảnh báo khi camera mất kết nối
- [ ] Thống kê thời gian hoạt động camera theo ngày/giờ
- [ ] Hỗ trợ ghi log camera (CameraLog table)
- [ ] Đóng gói thành Docker Image

---

## ✨ Gợi ý mở rộng

- Tích hợp Redis cache trạng thái camera
- Gửi log bất thường đến Kafka (log service riêng)
- Quản lý camera theo từng khu vực siêu thị
- Hỗ trợ kiểm soát quyền truy cập camera theo nhóm người dùng

---
