/** Hangman **/

$(document).ready(function() {

  var resource_url = 'http://hangman-api.herokuapp.com/hangman';

  $('#new-game').on('click', createNewGame);

  function createNewGame() {
    $.ajax({
      type: 'POST',
      url: resource_url
    }).done(function(data) {
      console.log(data); // e.g. Object {hangman: _____, token: "eySjf239gjs"}
      $('.hangman-word').text(data.hangman);
      $('.token').text(data.token);
      $('#new-game').hide();
    }).fail(function(data) {
      console.log(data);
    });
  }

});
