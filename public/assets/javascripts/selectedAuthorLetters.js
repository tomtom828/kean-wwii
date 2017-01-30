// On page load, Hit the API and load click listners
$(document).ready(function(){

  // Get Author Name from Route
  var authorRoute = decodeURI(window.location.pathname).split("/");
  var firstName = authorRoute[3];
  var lastName = authorRoute[2];

  // Spot Check names for Other
  if(firstName == 'Other'){
    // Change for Various vs. Unknown Soldier
    if(lastName == 'Various'){
      firstName = 'Various';
      lastName = "Authors";
    }
    else{
      firstName = "The";
    }
  }

  // Append Author name for all needed classes 
  $('.author-name').text(firstName + " " + lastName);

  // Collect all letters via Author Name (API Call)

});