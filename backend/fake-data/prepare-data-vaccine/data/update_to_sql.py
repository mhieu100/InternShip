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
with open("/home/mhieu/Coding/InternShip/backend/fake-data/prepare-data-vaccine/data/vaccines-detail.json", "r", encoding="utf-8") as f:
    data = json.load(f)




# 3. Insert dữ liệu vào bảng
for item in data:
    manufacturer = item.get("manufacturer", "")
    injection = item.get("injection", [])
    preserve = item.get("preserve", [])
    contraindications = item.get("contraindications", [])


    cur.execute(
        """
        UPDATE vaccines 
        SET description = %s ,manufacturer = %s ,injection = %s ,preserve = %s, contraindications = %s
        WHERE sku = %s
        """,
        (item["description"], manufacturer, injection, preserve, contraindications, item["sku"])
    )

# 4. Commit & đóng kết nối
conn.commit()
cur.close()
conn.close()

print("✅ Data updated successfully!")
