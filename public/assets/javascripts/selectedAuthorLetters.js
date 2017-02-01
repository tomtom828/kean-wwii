// On page load, Hit the API and load click listners
$(document).ready(function(){

  // Get Author Name from Route
  var authorRoute = decodeURI(window.location.pathname).split("/");
  var firstName = authorRoute[3];
  var lastName = authorRoute[2];

  // Spot Check names
  var displayFirstName = firstName;
  var displayLastName = lastName;

  if(firstName == 'Other'){
    // Change for Various vs. Unknown Soldier
    if(lastName == 'Various'){
      displayFirstName = 'Various';
      displayLastName = "Authors";
    }
    else{
      displayFirstName = "The";
    }
  }

  // Append Author name for all needed classes 
  $('.author-name').text(displayFirstName + " " + displayLastName);


  // Collect all letters via Author Name (API Call)
  var currentURL = window.location.origin;
  $.get(currentURL + '/api/letters/all/' + lastName + '/' + firstName, function(data){

    // Store repsonse
    allLetters = data;
    console.log(allLetters)

    // Set the default letter
    $('#currentLetter').text(allLetters[0].filename);

    // Hit API to collect article text
    getLetterText(allLetters[0].filename)

    // Render the proper Letter image
    var letterImageURL = "/resources/letter-image/" + allLetters[0].filename.toString() + ".jpg";
    $('#letterImage').attr({
      src: letterImageURL,
      alt: allLetters[0].filename.toString()
    });


    // Append File Names to the Read Drop Down Menu
    for(var i=0; i < allLetters.length; i++){
      var listItem = '<li class="letterListItem"><a href="#">' + allLetters[i].filename + '</a></li>';
      $('#letterDropDown').append(listItem);
    }

  });


  // Click Listener for Letter Selection
  $(document).on('click', '.letterListItem', function(){
    
    // Collect Image / Letter Entry Name
    var letterName = $(this).text();

    // Render the proper Letter image
    var letterImageURL = "/resources/letter-image/" + letterName + ".jpg";
    $('#letterImage').attr({
      src: letterImageURL,
      alt: letterName
    });

    // Hit API to collect article text
    getLetterText(letterName);

    // Prevent Default Click action
    return false;

  });


  // API Function - Get the Article Text
  var getLetterText = function(letterName){
    // Set up URL to hit API
    var currentURL = window.location.origin;
    $.get(currentURL + "/resources/letters/" + letterName, function(data){
      // Append Text to DOM
      $('#letterText').html(data);
    });
  }


});