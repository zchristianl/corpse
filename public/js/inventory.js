/* eslint-disable no-undef */
Array.from(document.getElementsByName('delete_item')).forEach(function (element) {
  element.addEventListener('click', function () {
    $('.deleteModal').val(element.value);
  });
});

$('.deleteModal').on('click', (e) => {
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