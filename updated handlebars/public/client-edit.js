async function saveButtonClicked() {
  const firstName = document.getElementById('add-first-name').value;
  const lastName = document.getElementById('add-last-name').value;
  const postalCode = document.getElementById('add-postal-code').value;

  const body = {
    firstName,
    lastName,
    postalCode,
  };

  const url = 'http://localhost:3000/client-save';
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }

  console.log(JSON.stringify(options, null, 4));

  let response = await fetch(url, options);
  response = await response.json();
  window.location='/client-list-page';
}

function cancelButtonClicked() {
  window.location='/client-list-page';
}

