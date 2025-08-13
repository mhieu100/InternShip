from faker import Faker
import json
from datetime import datetime, timedelta
import random

fake = Faker('es_ES')

num_records = 5760
users = []

start_time = datetime.strptime("07:00:00", "%H:%M:%S")

for i in range(num_records):
    alert_count = fake.random_int(min=1, max=6)
    osa_rate = fake.random_int(min=10, max=90)

    current_datetime = start_time + timedelta(seconds=i * 5)
    current_time_str = current_datetime.strftime("%H:%M:%S")

    operating_hours = (current_datetime.hour - start_time.hour) + 1

    # shortage_hours tăng theo operating_hours nhưng nhỏ hơn nhiều
    # Ví dụ: random từ 0.1 đến 40% của operating_hours
    shortage_hours = round(random.uniform(0.1, operating_hours * 0.4), 1)

    user = {
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
    users.append(user)

with open("fake_users.json", "w", encoding="utf-8") as f:
    json.dump(users, f, ensure_ascii=False, indent=4)

print("✅ Đã tạo file fake_users.json")
