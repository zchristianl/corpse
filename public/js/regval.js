document.getElementById('payment').addEventListener('change', (event) => {
  if (event.target.value === 'po') {
    document.getElementById('po_num_col').hidden = false;
  } else {
    document.getElementById('po_num_col').hidden = true;
  }
});