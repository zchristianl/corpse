/* eslint-disable no-undef */
$(document).ready(function(){
  $('.deleteModal').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('value');
    $.ajax({
      type: 'DELETE',
      url: '/delete/'+id,
    });
  });
});
