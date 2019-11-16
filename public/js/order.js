document.getElementById('edit_button').addEventListener('click', () => {
  makeEditable();
});

document.getElementById('add_payment').addEventListener('click', () => {
  addPayment();
});

Array.from(document.getElementsByName('delete')).forEach(function (element) {
  element.addEventListener('click', function () {
    deleteItem(element);
  });
});

function stdName(val) {
  switch (val) {
  case 'new':
    return 'New';
  case 'New':
    return 'new';
  case 'estimate':
    return 'Estimate';
  case 'Estimate':
    return 'esimate';
  case 'in-progress':
    return 'In-Progress';
  case 'In-Progress':
    return 'in-progress';
  case 'payment':
    return 'Payment';
  case 'Payment':
    return 'payment';
  case 'complete':
    return 'Complete';
  case 'Complete':
    return 'complete';
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
  default:
    return val;
  }
}

function makeEditable() {
  document.getElementById('edit_button').disabled = true;
  var orderState = ['new', 'estimate', 'in-progress', 'payment', 'complete'];
  /* var inquiryType = ['estimate', 'quote', 'grant'];
  var time_estimate = ['immediately', '1-3', '3-6', '6_or_more'];
  var intended_use = ['research_only', 'clinical_applications']; */

  /* Order State */
  var state = document.getElementById('order_state');
  var currState = state.innerText;
  var selectState = document.createElement('select');
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

  /*   // Nature of Inquiry
  var reason = document.getElementById('reason');
  var currReason = reason.innerText;
  var selectInquriy = document.createElement('select');
  selectInquriy.id = 'inquiry';

  inquiryType.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if (stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectInquriy.appendChild(option);
  });

  reason.innerHTML = '';
  reason.appendChild(selectInquriy);

  // Time Estimate
  var timeEstimate = document.getElementById('time_estimate');
  currReason = timeEstimate.innerText;
  var selectTimeEstimate = document.createElement('select');
  selectTimeEstimate.id = 'time_estimate_updated';

  time_estimate.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if (stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectTimeEstimate.appendChild(option);
  });

  timeEstimate.innerHTML = '';
  timeEstimate.appendChild(selectTimeEstimate);

  // Intended Use
  var intendedUse = document.getElementById('intended_use');
  currReason = intendedUse.innerText;
  var selectIntendedUse = document.createElement('select');
  selectIntendedUse.id = 'intended_use_new';

  intended_use.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if (stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectIntendedUse.appendChild(option);
  });

  intendedUse.innerHTML = '';
  intendedUse.appendChild(selectIntendedUse); */

  // Now the thing 
  var itemOps = document.getElementsByName('item_ops');
  itemOps.forEach(element => {
    element.removeAttribute('hidden');
  });
  document.getElementById('item_ops_head').hidden = false;
}

function deleteItem(item) {
  item.disabled = true;
  console.log('Delete Item: ' + item.value);
  // eslint-disable-next-line no-undef
  $.post({
    url: '/item/delete',
    data: {
      id: item.value
    },
    success: () => {
      var row = 'row_' + item.value;
      document.getElementById(row).remove();
    }
  });
}

function addPayment() {
  var paymentRow = document.getElementById('new_payment_row');
  if (paymentRow.hidden == true) {
    paymentRow.hidden = false;
  }
}

$('#submit_payment').submit(function (event) {
  console.log('here');
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

$('#order_state').change( () => {
  var newState = document.getElementById('state_new').value;
  $.post({
    url: '/order/modify',
    data: {
      id: document.getElementById('order_state').getAttribute('orderId'),
      state: stdName(newState)
    },
    success: () => {
      document.getElementById('order_state').innerText = stdName(newState);
      //location.reload();
    }
  });
});