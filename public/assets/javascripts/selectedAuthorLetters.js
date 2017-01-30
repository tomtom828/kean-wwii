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

    // Store repsonse globally
    allLetters = data;
    console.log(allLetters)

  });

});