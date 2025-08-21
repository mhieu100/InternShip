from faker import Faker
from datetime import datetime, timedelta
import random
import redis
import json
import time

fake = Faker('es_ES')

# Kết nối Redis
r = redis.Redis(host='localhost', port=6379, db=0)

start_time = datetime.strptime("07:00:00", "%H:%M:%S")

shelves = [
    "1",
    "2",
    "3",
    "4",
    "5"
]

# Initialize alert counts for each shelf
# Sử dụng một dictionary để lưu số lần cảnh báo trong mỗi giờ
shelf_alert_counts_per_hour = {shelf: 0 for shelf in shelves}
# Lưu thời gian bắt đầu của mỗi giờ
last_hour_start_time = start_time

num_batches = 5200

# Đặt giới hạn số lần cảnh báo mỗi giờ cho mỗi kệ
ALERT_LIMIT_PER_HOUR = 5

for batch in range(num_batches):
    current_datetime = start_time + timedelta(seconds=batch * 5)
    current_time_str = current_datetime.strftime("%H:%M:%S")
    operating_hours = (current_datetime.hour - start_time.hour) + 1

    # Kiểm tra và reset bộ đếm cảnh báo nếu đã sang giờ mới
    if current_datetime.hour != last_hour_start_time.hour:
        shelf_alert_counts_per_hour = {shelf: 0 for shelf in shelves}
        last_hour_start_time = current_datetime

    for shelf in shelves:
        is_alerted = False
        osa_rate = fake.random_int(min=10, max=90)

        # Logic để giới hạn số lần cảnh báo
        # Chỉ tạo cảnh báo nếu số lần cảnh báo trong giờ hiện tại chưa đạt giới hạn
        # và có 15% xác suất tạo cảnh báo (để tránh tạo cảnh báo liên tục)
        if shelf_alert_counts_per_hour[shelf] < ALERT_LIMIT_PER_HOUR:
            # Tăng xác suất xảy ra cảnh báo ở mức thấp (ví dụ: 15%)
            if random.random() < 0.15:
                is_alerted = True
                osa_rate = fake.random_int(min=0, max=30) # osa_rate thấp để kích hoạt alert
                shelf_alert_counts_per_hour[shelf] += 1

        # Nếu không có cảnh báo, tạo osa_rate bình thường
        if not is_alerted:
            osa_rate = fake.random_int(min=41, max=90)

        # Tính toán shortage_hours dựa trên operating_hours
        shortage_hours = round(random.uniform(0.1, operating_hours * 0.4), 1)

        record = {
            "shelfId": shelf,
            "operatingHours": operating_hours,
            "shortageHours": shortage_hours,
            "alertCount": shelf_alert_counts_per_hour[shelf], # Sử dụng bộ đếm mới
            "replenishCount": fake.random_int(min=0, max=shelf_alert_counts_per_hour[shelf]),
            "osaRate": osa_rate,
            "threshold": 40,
            "isAlerted": is_alerted,
            "date": "2025-08-15",
            "time": current_time_str
        }

        r.publish("data_stream", json.dumps(record, ensure_ascii=False))
        print(f"📢 [{current_time_str}] Shelf {shelf} → Publish record lên Redis Pub/Sub. Alerted: {is_alerted}")

    time.sleep(0.1)