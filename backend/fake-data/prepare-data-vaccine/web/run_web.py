from flask import Flask, render_template, request, jsonify
import json
import os
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def load_vaccine_list():
    """Load the list of vaccines from vaccine.json"""
    try:
        with open("data/vaccine.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def parse_vaccine_info(sku):
    """Parse vaccine information from VNVC website"""
    try:
        url = f"https://vnvc.vn/{sku}/"
        res = requests.get(url, timeout=10)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        # Find the vaccine information block
        block = soup.find("div", id="1-thong-tin-vac-xin")

        if not block:
            return None

        result = {"sku": sku}

        content = block.find("div", class_="content_item_list")
        if not content:
            return result

        # Get description from first paragraph
        first_p = content.find("p")
        if first_p:
            result["description"] = first_p.get_text(" ", strip=True)

        # Parse all h3 sections
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
    except Exception as e:
        print(f"Error parsing vaccine info for {sku}: {e}")
        return None

@app.route('/')
def index():
    """Main page with vaccine selection"""
    vaccines = load_vaccine_list()
    return render_template('vaccine_ui.html', vaccines=vaccines)

@app.route('/api/vaccine/<sku>')
def get_vaccine_detail(sku):
    """API endpoint to get vaccine details"""
    
    # If not found locally, try to parse from website
    parsed_info = parse_vaccine_info(sku)
    if parsed_info:
        return jsonify(parsed_info)
    
    return jsonify({"error": "Vaccine information not found"}), 404

@app.route('/api/vaccines')
def get_vaccine_list():
    """API endpoint to get list of all vaccines"""
    vaccines = load_vaccine_list()
    return jsonify(vaccines)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)