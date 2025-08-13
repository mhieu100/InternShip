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

num_records = 20  # ví dụ test 20 bản ghi

for i in range(num_records):
    alert_count = fake.random_int(min=1, max=6)
    osa_rate = fake.random_int(min=10, max=90)

    # Tính thời gian record
    current_datetime = start_time + timedelta(seconds=i * 5)
    current_time_str = current_datetime.strftime("%H:%M:%S")

    operating_hours = (current_datetime.hour - start_time.hour) + 1
    shortage_hours = round(random.uniform(0.1, operating_hours * 0.4), 1)

    record = {
        "shelf_name": "Vegetable_Shelf",
        "operating_hours": operating_hours,
        "shortage_hours": shortage_hours,
        "alert_count": alert_count,
        "replenish_count": fake.random_int(min=0, max=alert_count - 1),
        "osa_rate": osa_rate,
        "threshold": 40,
        "is_alert": osa_rate < 40,
        "date": "2025-08-13",
        "time": current_time_str
    }

    # Publish dữ liệu lên channel Redis
    r.publish("data_stream", json.dumps(record, ensure_ascii=False))
    print(f"📢 [{current_time_str}] Publish record lên Redis Pub/Sub")

    time.sleep(5)
