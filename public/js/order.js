/** Event Listeners */
document.getElementById('edit_button').addEventListener('click', () => {
  makeEditable();
});

document.getElementById('add_payment').addEventListener('click', () => {
  addPayment();
});

Array.from(document.getElementsByName('delete-confirm')).forEach(function (element) {
  console.log('i was also clicked');
  element.addEventListener('click', function () {
    deleteConfirm(element);
  });
});
/** End Event Listeners */

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
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
      location.reload();
    }
  });
});

$('#edit_button').click( () => {
  $.post({
    url: '/inventory/getsell',
    success: (res) => {
      console.log('We got some data back!');
      console.log(res);
      res.forEach(item => {
        var option = document.createElement('option');
        //option.text = item.
      });
      //$("services")
    }
  });
});