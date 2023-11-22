console.log('JavaScript code is loaded and executed');

function convertToAmazonCA(link) {
  // Replace "a.co" with "amazon.ca"
  const convertedLink = link.replace('a.co', 'amazon.ca');
  return convertedLink;
}

window.convertToAffiliate = function() {
  const inputField = document.getElementById('amazonLinkInput');
  const link = inputField.value.trim();
  const affiliateTag = 'azevedo014-20'; // Replace with your affiliate tag

   // Replace "a.co" with "amazon.ca" in the link
   const convertedLink = convertToAmazonCA(link);

   const asin = extractASIN(convertedLink);
   const linkId = extractLinkID(convertedLink);
 
   if (asin) {
     const convertedAffiliateLink = `//rcm-na.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=${affiliateTag}&language=en_CA&o=15&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=${asin}&linkId=${linkId}`;
 
     const iframe = document.createElement('iframe');
     iframe.src = convertedAffiliateLink;
     iframe.setAttribute('width', '120');
     iframe.setAttribute('height', '240');
     iframe.setAttribute('align-items', 'center');
     iframe.setAttribute('scrolling', 'no'); // Add scrolling="no" attribute
     iframe.style.overflow = 'hidden'; // Add overflow: hidden; CSS property
     iframe.style.border = 'none';
 
     const amazonLinksDiv = document.getElementById('amazonLinks');
     amazonLinksDiv.innerHTML = ''; // Clear previous content
     amazonLinksDiv.appendChild(iframe);
   } else {
     document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link or ASIN not found.';
   }
 }
 
 function extractASIN(link) {
   const asinMatch = link.match(/\/(?:dp|gp\/product|exec\/obidos|aw\/d)\/(B[0-9A-Z]{9}|\w{10})|a\.co\/(?:[^\/]+\/)?(dp|gp\/product|exec\/obidos|aw\/d)\/(\w{10})/);
   console.log('Link:', link);
   console.log('Match:', asinMatch);
   if (asinMatch) {
     return asinMatch[1] || asinMatch[3];
   } else {
     return '';
   }
 }
 
 function extractLinkID(link) {
   const linkIdMatch = link.match(/coliid=([\w\d]{10})/);
   return linkIdMatch ? linkIdMatch[1] : null;
 }
 
 document.addEventListener('DOMContentLoaded', function() {
   const convertButton = document.getElementById('convertButton');
 
   convertButton.addEventListener('click', function() {
     convertToAffiliate();
   });
 });
