import json
import redis

# Kết nối Redis (mặc định localhost:6379)
r = redis.Redis(host='localhost', port=6379, db=0)

# Đọc file JSON
with open("fake_users.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Lưu từng record vào Redis
for i, record in enumerate(data):
    key = f"data:{i}"
    r.set(key, json.dumps(record, ensure_ascii=False))

print(f"✅ Đã import {len(data)} record vào Redis")
