window.addEventListener('load', () => {
  var form = document.getElementById('form_registration');
  form.addEventListener('submit', (event) => {
    console.log('Submit clicked.');
    if (form.checkValidity() && validatePassword()) {
      console.log('all valid');
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);
}, false);

document.getElementById('payment').addEventListener('change', (event) => {
  if (event.target.value === 'po') {
    document.getElementById('po_num_col').hidden = false;
  } else {
    document.getElementById('po_num_col').hidden = true;
  }
});

function validatePassword() {
  if(document.getElementById('password').value === document.getElementById('password2').value) {
    console.log('password valid');
    return true;
  } else {
    console.log('password invalid');
    document.getElementById('password').classList += ' is-invalid';
    document.getElementById('password2').classList += ' is-invalid';
  }
}