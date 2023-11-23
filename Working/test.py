from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import time
import re

app = Flask(__name__)
CORS(app)

def convert_to_amazon_ca(a_co_link):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    try:
        # Send a GET request to the shortened URL
        response = requests.get(a_co_link, headers=headers)
        response.raise_for_status()

        # Check the final URL after all redirects
        final_url = response.url

        # Parse the final URL to extract the ASIN
        parsed_url = urlparse(final_url)
        path_components = parsed_url.path.split('/')
        asin_index = path_components.index('dp') + 1 if 'dp' in path_components else -1

        if asin_index != -1 and len(path_components) > asin_index:
            asin = path_components[asin_index]
            return f"https://www.amazon.ca/dp/{asin}"
        else:
            print("ASIN not found in the URL.")
            return None
    except requests.exceptions.HTTPError as e:
        print(f"HTTPError: {str(e)}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"RequestException: {str(e)}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return None


@app.route('/convert', methods=['GET', 'POST'])
@cross_origin()
def convert():
    if request.method == 'POST':
        data = request.get_json()
        a_co_link = data.get('link') if data else None
    else:
        a_co_link = request.args.get('link', default = None, type = str)

    print(f"a_co_link: {a_co_link}")  # print a_co_link

    if a_co_link is None:
        return jsonify({"error": "Missing link parameter"}), 400

    amazon_ca_link = convert_to_amazon_ca(a_co_link)
    print(f"amazon_ca_link: {amazon_ca_link}")  # print amazon_ca_link

    if amazon_ca_link is None:
        return jsonify({"error": "Unable to convert link"}), 400

    return jsonify({"amazon_ca_link": amazon_ca_link}), 200




if __name__ == '__main__':
    app.run(debug=True)
