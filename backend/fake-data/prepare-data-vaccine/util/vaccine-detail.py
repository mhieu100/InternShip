import requests
from bs4 import BeautifulSoup
import json

def parse_vaccine_info(sku):
    url = f"https://vnvc.vn/{sku}/"
    res = requests.get(url)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    # Dùng find thay vì select_one để tránh lỗi id bắt đầu bằng số
    block = soup.find("div", id="1-thong-tin-vac-xin")

    if not block:
        return None

    result = {"sku": sku}

    content = block.find("div", class_="content_item_list")
    if not content:
        return result

    # description từ p đầu tiên
    first_p = content.find("p")
    if first_p:
        result["description"] = first_p.get_text(" ", strip=True)

    # Lặp qua tất cả h3
    for h3 in content.find_all("h3"):
        field_name = h3.get_text(" ", strip=True)

        next_tag = h3.find_next_sibling()
        if not next_tag:
            continue

        if next_tag.name == "p":
            result[field_name] = next_tag.get_text(" ", strip=True)
        elif next_tag.name == "ul":
            items = [li.get_text(" ", strip=True) for li in next_tag.find_all("li")]
            result[field_name] = items

    return result


skus = ['gcflu-quadrivalent', 'varivax-vac-xin-phong-thuy-dau', 'vac-xin-varicella', 'vac-xin-mmr', 'vac-xin-5-trong-1-infanrix-ipv-hib', 'engerix-b-vac-xin-phong-viem-gan-b', 'vac-xin-euvax-b', 'jevax-vac-xin-phong-viem-nao-nhat-ban-b', 'typhoid-vi-polysaccharide-vi-vac-xin-phong-benh-thuong-han', 'stamaril-vac-xin-phong-benh-sot-vang']

all_data = []
for sku in skus:
    info = parse_vaccine_info(sku)
    if info:
        all_data.append(info)

with open("vaccines-detail_3.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
