function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Load Axios dynamically
loadScript('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js')
  .then(() => {
    // Axios is loaded, you can use it now

    async function getFullAmazonURL(shortenedURL) {
      try {
        const response = await axios.head(shortenedURL, { maxRedirects: 5 });
        return response.request.res.responseUrl;
      } catch (error) {
        console.error('Error:', error.message);
        return null;
      }
    }

    function convertToAffiliate() {
      const inputField = document.getElementById('amazonLinkInput');
      const link = inputField.value.trim();
      const affiliateTag = 'azevedo014-20'; // Replace with your affiliate tag

      const asin = extractASIN(link);
      const linkId = extractLinkID(link);

      if (asin) {
        getFullAmazonURL(link)
          .then((fullURL) => {
            if (fullURL) {
              const convertedLink = generateAmazonLink(asin, linkId, affiliateTag, fullURL);

              const iframe = document.createElement('iframe');
              iframe.src = convertedLink;
              iframe.setAttribute('width', '120');
              iframe.setAttribute('height', '240');
              iframe.setAttribute('align-items', 'center');
              iframe.setAttribute('scrolling', 'no');
              iframe.style.overflow = 'hidden';
              iframe.style.border = 'none';

              const amazonLinksDiv = document.getElementById('amazonLinks');
              amazonLinksDiv.innerHTML = '';
              amazonLinksDiv.appendChild(iframe);
            } else {
              document.getElementById('convertedLink').innerHTML = 'Unable to retrieve the full URL.';
            }
          })
          .catch((err) => console.error('Error:', err));
      } else {
        document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link or ASIN not found.';
      }
    }

function extractASIN(link) {
  if (link.includes('a.co/')) {
    const parts = link.split('/');
    const asinPart = parts.find(part => part.length === 7); // ASIN is assumed to be a 7-character string
    return asinPart || '';
  } else {
    const asinMatch = link.match(/\/(?:dp|gp\/product|exec\/obidos|aw\/d)\/(B[0-9A-Z]{9}|\w{10})/);
    return asinMatch ? asinMatch[1] : '';
  }
}

function extractLinkID(link) {
  const linkIdMatch = link.match(/coliid=([\w\d]{10})/);
  return linkIdMatch ? linkIdMatch[1] : null;
}

function generateAmazonLink(asin, linkId, affiliateTag) {
  return `//rcm-na.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=${affiliateTag}&language=en_CA&o=15&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=${asin}&linkId=${linkId}`;
}

document.addEventListener('DOMContentLoaded', function() {
  const convertButton = document.getElementById('convertButton');

  convertButton.addEventListener('click', function() {
    convertToAffiliate();
  });
});

})
.catch((error) => {
  console.error('Error loading Axios:', error);
});