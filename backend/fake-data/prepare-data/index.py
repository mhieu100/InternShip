from bs4 import BeautifulSoup
import json
import re
from urllib.parse import urlparse

# Đọc file HTML
with open("/home/mhieu/Coding/InternShip/backend/fake-data/prepare-data/vaccine.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

data = []

for item in soup.select(".item_vacxin"):
    # Link chi tiết
    link_tag = item.find("a")
    url = link_tag["href"] if link_tag else None

    # SKU lấy từ URL (phần cuối không có /)
    sku = None
    if url:
        path = urlparse(url).path.strip("/")
        sku = path.split("/")[-1]  # vd: vac-xin-menquadfi

    # Ảnh
    img_tag = item.find("img")
    image = img_tag["src"] if img_tag else None

    # Tên và quốc gia
    title_tag = item.find("a", class_="title_item_vacxin")
    raw_title = title_tag.get_text(strip=True) if title_tag else None

    name, country, title = None, None, None
    if raw_title:
        match = re.match(r"Vắc xin (.+?)(?: \((.+)\))?$", raw_title)
        if match:
            name, country = match.groups()
            title = f"Vắc xin {name}"  # bỏ quốc gia

    # Mô tả
    desc_tag = item.find("p")
    description = desc_tag.get_text(strip=True) if desc_tag else None

    data.append({
        "sku": sku,
        "title": title,
        "name": name,
        "country": country,
        "url": url,
        "image": image,
        "description": description
    })

# Xuất ra file JSON
with open("vacxin.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Đã xuất JSON thành công!")
