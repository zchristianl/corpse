document.getElementById('edit_button').addEventListener('click', function(){
  makeEditable();
});

function stdName(val) {
  switch(val) {
  case 'new':
    return 'New';
  case 'estimate':
    return 'Estimate';
  case 'in-progress':
    return 'In-Progress';
  case 'payment':
    return 'Payment';
  case 'complete':
    return 'Complete';
  case 'grant':
    return 'grant';
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
  //var orderState = ['new', 'estimate', 'in-progress', 'payment', 'complete'];
  var inquiryType = ['estimate', 'quote', 'grant'];
  var time_estimate = ['immediately', '1-3', '3-6', '6_or_more'];
  var intended_use = ['research_only', 'clinical_applications'];

  /* Nature of Inquiry */
  var reason = document.getElementById('reason');
  var currReason = reason.innerText;
  var selectOrderState = document.createElement('select');
  selectOrderState.id = 'state';

  inquiryType.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if(stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectOrderState.appendChild(option);
  });

  reason.innerHTML = '';
  reason.appendChild(selectOrderState);

  /* Time Estimate */
  var timeEstimate = document.getElementById('time_estimate');
  currReason = timeEstimate.innerText;
  var selectTimeEstimate = document.createElement('select');
  selectTimeEstimate.id = 'state';

  time_estimate.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if(stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectTimeEstimate.appendChild(option);
  });

  timeEstimate.innerHTML = '';
  timeEstimate.appendChild(selectTimeEstimate);

  /* Intended Use */
  var intendedUse = document.getElementById('intended_use');
  currReason = intendedUse.innerText;
  var selectIntendedUse = document.createElement('select');
  selectIntendedUse.id = 'state';

  intended_use.forEach(element => {
    var option = document.createElement('option');
    option.value = element;
    option.innerText = stdName(element);
    if(stdName(element) === currReason) {
      option.selected = 'selected';
    }
    selectIntendedUse.appendChild(option);
  });

  intendedUse.innerHTML = '';
  intendedUse.appendChild(selectIntendedUse);
}