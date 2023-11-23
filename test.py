from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import time
import re

app = Flask(__name__)
CORS(app, resources={r"/convert": {"origins": "*"}})

def find_product_asin(a_co_link):
 try:
     response = requests.get(a_co_link)
     response.raise_for_status()

     soup = BeautifulSoup(response.content, 'html.parser')
     amazon_ca_link = soup.find('a', href=lambda href: href and href.startswith('https://www.amazon.ca/dp/'))

     if not amazon_ca_link:
         print("Unable to find Amazon.ca link.")
         return None

     product_id = amazon_ca_link.get('href')
     parsed_url = urlparse(product_id)
     path_components = parsed_url.path.split('/')
     asin_index = path_components.index('dp') + 1 if 'dp' in path_components else -1

     if asin_index != -1 and len(path_components) > asin_index:
         asin = path_components[asin_index]
         return asin
     else:
         print("ASIN not found in the URL.")
         return None

 except requests.exceptions.HTTPError as e:
     if e.response.status_code == 500:
         print("URL being processed:", a_co_link) # Print the URL being processed
         asin = re.search(r'/[dg]p/([^/]+)', a_co_link, flags=re.IGNORECASE)
         if asin:
             return asin.group(1)
         else:
             print("ASIN not found in the URL.")
             return None
     print(f"HTTPError: {str(e)}")
     return None
 except requests.exceptions.RequestException as e:
     print(f"RequestException: {str(e)}")
     return None
 except Exception as e:
     print(f"An unexpected error occurred: {str(e)}")
     return None

def convert_to_amazon_ca(a_co_link):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    try:
        # Check if the link is from Amazon.ca
        if 'amazon.ca' in a_co_link:
            # If it's an Amazon.ca link, return None or handle as needed
            return None
        response = requests.get(a_co_link, headers=headers)
        response.raise_for_status()
        time.sleep(2)

        asin = find_product_asin(a_co_link)

        if not asin:
            app.logger.error("ASIN not found in the URL.")
            return None

        amazon_ca_link = f"https://www.amazon.ca/dp/{asin}"
        return amazon_ca_link

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 500:
            return a_co_link
        app.logger.error(f"HTTPError: {str(e)}")
        return None
    except requests.RequestException as e:
        app.logger.error(f"Failed to fetch the page. Error: {str(e)}")
        return None
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return None
@app.route('/convert', methods=['POST'])
@cross_origin()
def handle_conversion():
    data = request.get_json()
    amazon_link = data.get('link')

    amazon_ca_link = convert_to_amazon_ca(amazon_link)

    return jsonify({'amazon_ca_link': amazon_ca_link})

if __name__ == '__main__':
    app.run(debug=True)
