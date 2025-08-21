import json
import psycopg2

# 1. Kết nối đến PostgreSQL
conn = psycopg2.connect(
    dbname="safevax",
    user="postgres",
    password="20112003",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# 2. Đọc file JSON
with open("/home/mhieu/Coding/InternShip/backend/fake-data/prepare-data-vaccine/data/vaccine.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 3. Insert dữ liệu vào bảng
for item in data:
    cur.execute(
        """
        INSERT INTO vaccines (name, sku, title, country, image, description_short)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        (item["name"], item["sku"], item["title"], item["country"], item["image"], item["description_short"])
    )

# 4. Commit & đóng kết nối
conn.commit()
cur.close()
conn.close()

print("✅ Data inserted successfully!")
