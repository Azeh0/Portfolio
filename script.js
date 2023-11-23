console.log('JavaScript code is loaded and executed');

function extractASIN(link) {
  const asinMatch = link.match(/(\/dp\/|\/gp\/product\/|\/exec\/obidos\/|\/aw\/d\/)([A-Z0-9]{10})/i);
  console.log('Link:', link);
  console.log('Match:', asinMatch);
  if (asinMatch) {
    return asinMatch[2];
  } else {
    return '';
  }
}

function extractLinkID(link) {
  const linkIdMatch = link.match(/coliid=([\w\d]{10})/);
  return linkIdMatch ? linkIdMatch[1] : null;
}

window.convertToAffiliate = function() {
  const inputField = document.getElementById('amazonLinkInput');
  const link = inputField.value.trim();
  const affiliateTag = 'azevedo014-20'; // Replace with your affiliate tag
  const amazonCALinkRegex = /https?:\/\/(www\.)?amazon\.ca/;

  fetch('https://azeh.pythonanywhere.com/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ link: link })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to convert link');
    }
    return response.json();
  })
  .then(data => {
    const amazonCALink = data.amazon_ca_link;
    const asin = extractASIN(amazonCALink);
    const linkId = extractLinkID(amazonCALink);

    if (amazonCALink && asin) {
      const convertedAffiliateLink = `//rcm-na.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=${affiliateTag}&language=en_CA&o=15&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=${asin}&linkId=${linkId}`;

      const iframe = document.createElement('iframe');
      iframe.src = convertedAffiliateLink;
      iframe.setAttribute('width', '120');
      iframe.setAttribute('height', '240');
      iframe.setAttribute('align-items', 'center');
      iframe.setAttribute('scrolling', 'no');
      iframe.style.overflow = 'hidden';
      iframe.style.border = 'none';

      const amazonLinksDiv = document.getElementById('amazonLinks');
      amazonLinksDiv.innerHTML = ''; // Clear previous content
      amazonLinksDiv.appendChild(iframe);
    } else {
      document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link or ASIN not found.';
    }

    console.log('Processed link:', amazonCALink);
  })
  .catch(error => console.error('Error:', error.message));
};

document.addEventListener('DOMContentLoaded', function() {
  const convertButton = document.getElementById('convertButton');

  convertButton.addEventListener('click', function() {
    convertToAffiliate();
  });
});
