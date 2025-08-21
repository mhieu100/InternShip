import json

with open("vaccine.json", "r", encoding="utf-8") as f:
    data = json.load(f)

skus = [v["sku"] for v in data]

print(skus)
