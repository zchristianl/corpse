/** Event Listeners */
document.getElementById('edit_button').addEventListener('click', () => {
  makeEditable();
});

document.getElementById('add_payment').addEventListener('click', () => {
  addPayment();
});

Array.from(document.getElementsByName('delete-confirm')).forEach(function (element) {
  element.addEventListener('click', function () {
    deleteConfirm(element);
  });
});

Array.from(document.getElementsByName('delete-note-confirm')).forEach(function (element) {
  element.addEventListener('click', function () {
    deleteNoteConfirm(element);
  });
});

Array.from(document.getElementsByName('delete-payment-confirm')).forEach(function (element) {
  element.addEventListener('click', function () {
    deletePaymentConfirm(element);
  });
});

/** End Event Listeners */

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

function stdName(val) {
  switch (val) {
  case 'NEW':
    return 'New';
  case 'New':
    return 'NEW';
  case 'ESTIMATE':
    return 'Estimate';
  case 'Estimate':
    return 'ESTIMATE';
  case 'IN-PROGRESS':
    return 'In-Progress';
  case 'In-Progress':
    return 'IN-PROGRESS';
  case 'PAYMENT':
    return 'Payment';
  case 'Payment':
    return 'PAYMENT';
  case 'COMPLETE':
    return 'Complete';
  case 'Complete':
    return 'COMPLETE';
  case 'grant':
    return 'Grant';
  case 'immediately':
    return 'Immediately';
  case '1-3':
    return '1-3 Months';
  case '3-6':
    return '3-6 Months';
  case '6_or_more':
    return '6+ Months';
  case 'research_only':
    return 'Research Only';
  case 'clinical_applications':
    return 'Clinical Applications';
  case 'quote':
    return 'Quote';
  case 'cc':
    return 'Credit Card';
  case 'check':
    return 'Check';
  case 'po':
    return 'Purchase Order';
  default:
    return val;
  }
}

function makeEditable() {
  $('#itemtable').attr('hidden', false);
  document.getElementById('edit_button').disabled = true;
  var orderState = ['NEW', 'ESTIMATE', 'IN-PROGRESS', 'PAYMENT', 'COMPLETE'];

  /* Order State */
  var state = document.getElementById('order_state');
  var currState = state.innerText;
  var selectState = document.createElement('select');
  selectState.classList.add('w-auto', 'custom-select');
  selectState.id = 'state_new';

  orderState.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if (stdName(element) === currState) {
      option.selected = 'selected';
    }
    selectState.appendChild(option);
  });

  state.innerHTML = '';
  state.appendChild(selectState);

  // Now the thing 
  var itemOps = document.getElementsByName('item_ops');
  itemOps.forEach(element => {
    element.removeAttribute('hidden');
  });
  document.getElementById('item_ops_head').hidden = false;
  document.getElementById('new_item_row').hidden = false;
}

function deleteItem(item) {
  item.disabled = true;
  $.post({
    url: '/item/delete',
    data: {
      id: item.value
    },
    success: () => {
      /*  var row = 'row_' + item.value;
      document.getElementById(row).remove(); */
      location.reload();
    }
  });
}

function deletePayment(item) {
  item.disabled = true;
  $.post({
    url: '/payment/delete',
    data: {
      id: item.value
    },
    success: () => {
      location.reload();
    }
  });
}

function deleteNote(note) {
  note.disabled = true;
  $.post({
    url: '/note/delete',
    data: {
      id: note.value
    },
    success: () => {
      location.reload();
    }
  });
}

function deleteConfirm(element) {
  $('.tooltip').tooltip('hide');
  element.innerText = 'Confirm?';
  element.setAttribute('name', 'delete');
  Array.from(document.getElementsByName('delete')).forEach(function (element) {
    element.addEventListener('click', function () {
      deleteItem(element);
    });
  });
}

function addPayment() {
  $('#paytable').attr('hidden', false);
  var paymentRow = document.getElementById('new_payment_row');
  if (paymentRow.hidden == true) {
    paymentRow.hidden = false;
  }

  $('#pay_ops_head').attr('hidden', false);
  var payOps = document.getElementsByName('pay_ops');
  payOps.forEach(element => {
    element.removeAttribute('hidden');
  });

}

function deletePaymentConfirm(element) {
  $('.tooltip').tooltip('hide');
  element.innerText = 'Confirm?';
  element.setAttribute('name', 'delete');
  Array.from(document.getElementsByName('delete')).forEach(function (element) {
    element.addEventListener('click', function () {
      deletePayment(element);
    });
  });
}

function deleteNoteConfirm(element) {
  $('.tooltip').tooltip('hide');
  element.innerText = 'Confirm?';
  element.setAttribute('name', 'delete');
  Array.from(document.getElementsByName('delete')).forEach(function (element) {
    element.addEventListener('click', function () {
      deleteNote(element);
    });
  });
}

$('#submit_payment').submit(function (event) {
  event.preventDefault();
  $('#submit_payment_button').attr('disabled', true);
  var data = $(this).serialize();
  $.post({
    url: '/payment/create',
    data: data,
    success: () => {
      location.reload();
    }
  });
});

$('#order_state').change(() => {
  $('#state_new').attr('disabled', true);
  var newState = $('#state_new').val();
  $.post({
    url: '/order/modify',
    data: {
      id: document.getElementById('order_state').getAttribute('orderId'),
      state: stdName(newState)
    },
    success: () => {
      document.getElementById('order_state').innerText = stdName(newState);
      location.reload();
    }
  });
});

$('#edit_button').click(() => {
  $.post({
    url: '/inventory/getsell',
    success: (res) => {
      $('#services').prop('disabled', false);
      $('#loading-service').remove();
      res.forEach(item => {
        var option = document.createElement('option');
        option.text = `${item.name} (${item.category})`;
        option.value = item.id;
        option.setAttribute('price', item.price);
        $('#services').append(option);
      });
      $('#item_amount').val($('#services option:selected').attr('price'));
    }
  });
});

$('#services').change(() => {
  $('#item_amount').val($('#services option:selected').attr('price'));
});

$('#new_item').submit(function (event) {
  console.log('New item clicked');
  event.preventDefault();
  $('#submit_item_button').attr('disabled', true);
  var data = $(this).serialize();
  $.post({
    url: '/item/create',
    data: data,
    success: () => {
      location.reload();
    }
  });
});