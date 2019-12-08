document.getElementById('add_note').addEventListener('click', () => {
  addNotes();
});

function addNotes() {
  $('#notestable').attr('hidden', false);
  var notesRow = document.getElementById('new_message_row');
  if (notesRow.hidden == true) {
    notesRow.hidden = false;
  }

  $('#notes_ops_head').attr('hidden', false);
  var noteOps = document.getElementsByName('note_ops');
  noteOps.forEach(element => {
    element.removeAttribute('hidden');
  });

}

$('#newnote').submit(function (event) {
  console.log('Here!');
  event.preventDefault();
  $('#submit_note_button').attr('disabled', true);
  var data = $(this).serialize();
  $.post({
    url: '/note/create',
    data: data,
    success: () => {
      location.reload();
    }
  });
});

