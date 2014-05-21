/** Hangman **/

function createNewGame() {
  $.ajax({
    type: 'POST',
    url: 'http://hangman-api.herokuapp.com/hangman'
  }).done(function(response) {
    console.log(response); // e.g. Object {hangman: _____, token: "eySjf239gjs"}
    initialDisplay(response);
  }).fail(function(response) {
    console.log(response);
  });
}

function initialDisplay(response) {
  updateHangmanWord(response);
  updateGameToken(response);
  $('#new-game').hide(); // hide 'Start a new game' button
  $('#guess').show(); // show 'Guess' button
  $('.letter').val(''); // clear guess input
  $('.letter').show(); // show guess input box
  $('.remaining').text('7'); // make sure it says '7 guesses left'
  $('.remaining-guesses').show(); // show 'X guesses left'
  $('.attempts').find('span').remove(); // clean up wrong guesses
}

function updateHangmanWord(response) {
  $('.hangman-word').text(response.hangman);
}

function updateGameToken(response) {
  $('.token').text(response.token);
}

function submitGuess() {
  var game_token = $('.token').text(); // .val() doesn't work here
  var guess = $('.letter').val();
  $.ajax({
    type: 'PUT',
    url: 'http://hangman-api.herokuapp.com/hangman',
    data: {
      token: game_token,
      letter: guess
    }
  }).done(function(response) {
    if (response.correct) { // response.correct will be true or false
      console.log("Yay!");
      updateHangmanWord(response);
      updateGameToken(response);
    } else {
      console.log("Boooo");
      var wrong_attempts = $('.wrong').length + 1;
      var wrong_html = '<span class="wrong">' + wrong_attempts + '</span>';
      $('.attempts').append(wrong_html);
      if (wrong_attempts == 7) {
        retrieveSolution(game_token);
      } else {
        console.log("triggered");
        $('.remaining').text(7 - wrong_attempts);
      }
    }
    $('.letter').val(''); // clear guess input
  }).fail(function(response) {
    console.log('AJAX ERROR', response);
  })
}

function retrieveSolution(game_token) {
  $.ajax({
    type: 'GET',
    url: 'http://hangman-api.herokuapp.com/hangman',
    data: { token: game_token }
  }).done(function(response) {
    $('.hangman-word').text(response.solution);
    $('.letter').hide();
    $('#guess').hide();
    $('.remaining-guesses').hide();
    $('#new-game').show();
    updateGameToken(response);
  }).fail(function(response) {
    console.log('AJAX ERROR', response);
  })
}

$(document).ready(function() {
  $('#new-game').on('click', createNewGame);
  $('#guess').on('click', submitGuess);
});
