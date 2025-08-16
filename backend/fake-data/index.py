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
shelf_alert_counts = {shelf: 0 for shelf in shelves}



num_batches = 20 

for batch in range(num_batches):
    current_datetime = start_time + timedelta(seconds=batch * 2)
    current_time_str = current_datetime.strftime("%H:%M:%S")
    operating_hours = (current_datetime.hour - start_time.hour) + 1
    
    for shelf in shelves:
        
        osa_rate = fake.random_int(min=10, max=90)
        threshold = 40
        is_alerted = osa_rate > threshold
        
        if is_alerted:
            shelf_alert_counts[shelf] += 1
       
        shortage_hours = round(random.uniform(0.1, operating_hours * 0.4), 1)

        record = {
            "shelfId": shelf,
            "operatingHours": operating_hours,
            "shortageHours": shortage_hours,
            "alertCount": shelf_alert_counts[shelf],
            "replenishCount": fake.random_int(min=0, max=shelf_alert_counts[shelf]),
            "osaRate": osa_rate,
            "threshold": threshold,
            "isAlerted": is_alerted,
            "date": "2025-08-16",
            "time": current_time_str
        }

        r.publish("data_stream", json.dumps(record, ensure_ascii=False))
        print(f"📢 [{current_time_str}] {shelf} → Publish record lên Redis Pub/Sub")

    time.sleep(5)
