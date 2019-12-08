/* eslint-disable no-undef */
$('.deleteButton').on('click', (e) => {
  var itemId = $(e.target).attr('value');
  console.log(itemId);
  console.log(e.target.getAttribute('value'));
  console.log(e.target);
  $('.deleteModal').val(itemId);
});

$('.deleteModal').on('click', (e) => {
  console.log('here');
  $target = $(e.target);
  $.ajax({
    type: 'POST',
    url: '/inventory/delete/' + $target.attr('value'),
    dataType: 'json',
    success: function (response) {
      if (response.redirect !== undefined && response.redirect) {
        window.location.href = response.redirect;
      }
    }
  });
}); 