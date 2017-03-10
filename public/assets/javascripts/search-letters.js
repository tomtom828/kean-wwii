// Append all Authors and have user able to click which letter they want

// Global variable to search by first v. last name
var searchByLastName = true;

// On page load, Hit the Authors API and load click listners
$(document).ready(function(){

  // Click listner for Last Name
  $('#lastNameSearch').on('click', function(){
    searchByLastName = true;

    // Update Dropdown Button Text
    $('#authorLastOrFirstName').html('Last Name <span class="caret"></span>');
  });


  // Click listner for First Name
  $('#firstNameSearch').on('click', function(){
    searchByLastName = false;

    // Update Dropdown Button Text
    $('#authorLastOrFirstName').html('First Name <span class="caret"></span>');
  });



  

});