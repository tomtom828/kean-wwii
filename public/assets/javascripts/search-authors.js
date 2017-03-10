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


  // Click Listener for Submit Button
  $('#authorSearchSubmit').on('click', function(){
  
    // Get user input string
    var searchBoxInput = $('#autherSearchBox').val().trim().toLowerCase();
    
    // Alert User for empty entry
    if(searchBoxInput == ""){
      alert('Please enter a first or last name!')
    }
    // First Name
    else if(!searchByLastName){
      // Redirect to search page by first name
      window.location = '/search/authors/firstname/' + searchBoxInput;
    }
    // Lastname
    else{
      // Redirect to search page by last name
      window.location = '/search/authors/lastname/' + searchBoxInput;
    }

  });


  // Click Listener to change URL (needed for non-Chrome browser)
  // $('.author_box').on('click', function() {

  //   // Get data attributes
  //   var firstName = $(this).data('firstname');
  //   var lastName = $(this).data('lastname');

  //   // Redirect to author page
  //   window.location = '/authors/' + lastName + '/' + firstName;
    
  // });
  

});