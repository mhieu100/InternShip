import json

with open("vacxin.json", "r", encoding="utf-8") as f:
    data = json.load(f)

skus = [v["sku"] for v in data]

print(skus)
