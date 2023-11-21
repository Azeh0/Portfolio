console.log('JavaScript code is loaded and executed');

window.convertToAffiliate = function() {
  const inputField = document.getElementById('amazonLinkInput');
  const link = inputField.value.trim();
  const affiliateTag = 'azevedo014-20'; // Replace with your affiliate tag

  if (link.includes('amazon')) {
    const asin = extractASIN(link);
    const linkId = extractLinkID(link);

    if (asin && linkId) {
      const convertedLink = `//rcm-na.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=${affiliateTag}&language=en_CA&o=15&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=${asin}&linkId=${linkId}`;

      const iframe = document.createElement('iframe');
      iframe.src = convertedLink;
      iframe.setAttribute('width', '120');
      iframe.setAttribute('height', '240');
      iframe.setAttribute('scrolling', 'no'); // Add scrolling="no" attribute
      iframe.style.overflow = 'hidden'; // Add overflow: hidden; CSS property
      iframe.style.border = 'none';

      const amazonLinksDiv = document.getElementById('amazonLinks');
      amazonLinksDiv.innerHTML = ''; // Clear previous content
      amazonLinksDiv.appendChild(iframe);
    } else {
      document.getElementById('convertedLink').innerHTML = 'Invalid Amazon link format.';
    }
  } else {
    document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link.';
  }
}

function extractASIN(link) {
  const match = link.match(/\/(dp|gp\/product)\/(\w{10})/);
  return match ? match[2] : '';
}

function extractLinkID(link) {
  const match = link.match(/coliid=([\w\d]{10})/);
  return match ? match[1] : '';
}

document.addEventListener('DOMContentLoaded', function() {
  const convertButton = document.getElementById('convertButton');

  convertButton.addEventListener('click', function() {
    convertToAffiliate();
  });
});
