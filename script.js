function convertToAffiliate() {
  const inputField = document.getElementById('amazonLinkInput');
  const link = inputField.value.trim();
  const affiliateTag = 'azevedo014-20'; // Replace with your affiliate tag

  if (link.includes('amazon')) {
    let convertedLink = link;
    if (!link.includes('tag=')) {
      if (link.includes('?')) {
        convertedLink += `&tag=${affiliateTag}`;
      } else {
        convertedLink += `?tag=${affiliateTag}`;
      }
    }

    const iframe = document.createElement('iframe');
    iframe.src = convertedLink;
    iframe.style.width = '120px';
    iframe.style.height = '240px';
    iframe.style.border = 'none';

    document.getElementById('convertedLink').innerHTML = '';
    document.getElementById('convertedLink').appendChild(iframe);
  } else {
    document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link.';
  }
}
