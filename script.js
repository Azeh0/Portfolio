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
  
      document.getElementById('convertedLink').innerHTML = `<a href="${convertedLink}" target="_blank">${convertedLink}</a>`;
    } else {
      document.getElementById('convertedLink').innerHTML = 'Not a valid Amazon link.';
    }
  }
  
  