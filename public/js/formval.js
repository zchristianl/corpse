/**
 * Shows the PO # field if PO number is selected.
 */
document.getElementById('payment').addEventListener('change', (event) => {
  if (event.target.value === 'po') {
    document.getElementById('po_num_col').hidden = false;
  } else {
    document.getElementById('po_num_col').hidden = true;
  }
});

window.addEventListener('load', () => {
  var forms = document.getElementsByClassName('needs-validation');
  Array.prototype.filter.call(forms, (form) => {
    form.addEventListener('submit', (event) => {
      console.log('somethin submitted!');
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);
