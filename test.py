from flask import Flask, request, jsonify
from flask_cors import CORS # Import the CORS class
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

def convert_to_amazon_ca(a_co_link):
   try:
       # Get the ASIN from the a.co link
       response = requests.get(a_co_link)
       if response.status_code != 200:
           print(f"Failed to fetch the page. Status code: {response.status_code}")
           return None
       
       soup = BeautifulSoup(response.content, 'html.parser')
       canonical_link = soup.find('link', {'rel': 'canonical'})
       
       if not canonical_link:
           print("Unable to find canonical link.")
           return None
       
       product_id = canonical_link.get('href')
       
       parsed_url = urlparse(product_id)
       path_components = parsed_url.path.split('/')
       asin_index = path_components.index('dp') + 1 if 'dp' in path_components else -1
       
       if asin_index != -1 and len(path_components) > asin_index:
           asin = path_components[asin_index]
       else:
           print("ASIN not found in the URL.")
           return None

       # Search for the ASIN on Amazon.ca
       amazon_ca_link = f"https://www.amazon.ca/dp/{asin}"
       return amazon_ca_link
   
   except Exception as e:
       print(f"An error occurred: {str(e)}")
       return None

@app.route('/convert', methods=['POST'])
def handle_conversion():
   data = request.get_json()
   amazon_link = data.get('link')

   amazon_ca_link = convert_to_amazon_ca(amazon_link)

   return jsonify({'amazon_ca_link': amazon_ca_link})

if __name__ == '__main__':
   app.run(debug=True)
