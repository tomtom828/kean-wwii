// Append all Authors and have user able to click which letter they want


// Global variable for authors JSON
var allAuthorsArray;


// Global variable to search by first v. last name
var searchByLastName = true;

// On page load, Hit the Authors API and load click listners
$(document).ready(function(){

  // One time AJAX call for private SQL database Query
  var currentURL = window.location.origin;
  $.get(currentURL + "/api/authors/all", function(data){

    // Store repsonse globally
    allAuthorsArray = data;
    console.log(data)

    // Default to appending Letter A on page load
    appendAuthorsByLetter('A');
  });


  // Click Listener for Letter buttons
  $('.alpha').on('click', function(){

    // Grab the input from the textbox
    var selectedLetter = $(this).val();

    // Clear the DOM
    $('#author_list').empty();
    
    // Pass letter into appending
    appendAuthorsByLetter(selectedLetter);

  });


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
      // Clear DOM
       $('#author_list').empty();
      // Iterate through JSON response
      appendAuthorsByFirstName(searchBoxInput);
    }
    // Lastname
    else{
      // Clear DOM
      $('#author_list').empty();
      // Iterate through JSON response
      appendAuthorsByLastName(searchBoxInput);
    }

  });



  // Click Listner for Author Meta Data (brings user to selected author's page)
  $(document).on('click', '.author_box', function(){

    // Collect first and last name
    var nameAttribute = $(this).data('name').split('-');
    var firstName = nameAttribute[1];
    var lastname = nameAttribute[0];

    // Redirect to selected author's page
    var baseURL = window.location.origin;
    var authorURL = baseURL + '/authors/' + lastname + '/' + firstName;
    window.location.href = authorURL;

  });

});



// Function to append author JSON to DOM on Letter Click
function appendAuthorsByLetter(letter){

  // Test variable for letters with no author
  var noAuthorForThatLetter = true;

  // Iterate through JSON
  for(var i=0; i < allAuthorsArray.length; i++){

    // Append if lastname starts with selected letter
    if(allAuthorsArray[i].lastname[0].toUpperCase() == letter){

      // Yes, we have an author with that letter
      noAuthorForThatLetter = false;

      // Create new Author Div (inside a button)
      var currentAuthorButton = $('<button>');
      var currentAuthorDiv = $('<div>');
      currentAuthorDiv.addClass('author_box centered'); // Added a class
      currentAuthorDiv.attr('data-name', allAuthorsArray[i].lastname + '-' + allAuthorsArray[i].firstname); // Added a Data Attribute (for the other click listener)
          

      // Append Author Image to current div
      var awsAuthorPhotoURL = 'https://s3.amazonaws.com/kean-wwii-scrapbook/author-photos/' + allAuthorsArray[i].lastname.toLowerCase() + '-' + allAuthorsArray[i].firstname.toLowerCase() + '.jpg';
      console.log(awsAuthorPhotoURL)
      var currentAuthorImage = $('<img>');
      currentAuthorImage.addClass('author_image'); // Added a class
      currentAuthorImage.attr("src", awsAuthorPhotoURL);
      currentAuthorImage.attr("alt", allAuthorsArray[i].firstname + ' ' + allAuthorsArray[i].lastname);
      currentAuthorDiv.append(currentAuthorImage);


      // Append Footer to current div
      var currentAuthorFooter = $('<h3>');
      currentAuthorFooter.addClass('author_footer'); // Added a class
      currentAuthorFooter.text(allAuthorsArray[i].lastname + ', ' + allAuthorsArray[i].firstname);
      currentAuthorDiv.append(currentAuthorFooter);
      

      // Append into button
      currentAuthorButton.append(currentAuthorDiv)

      // Append current Div to the DOM
      $('#author_list').append(currentAuthorButton);

    } // end if

  } // end for loop


  // If there is no author with that letter, then display message
  if(noAuthorForThatLetter){

    // Dynamically append message to DOM
    var noAuthorMessage = $('<h3>Sorry. There are no authors listed under that letter.</h3>');
    $('#author_list').append(noAuthorMessage);

  }

}



// Function to append author JSON to DOM on name search
function appendAuthorsByLastName(nameInput){

  // Test variable for no author found
  var noAuthorForThatName = true;

  // Iterate through JSON
  for(var i=0; i < allAuthorsArray.length; i++){

    // Append if lastname starts with selected letter
    if(allAuthorsArray[i].lastname.toLowerCase() == nameInput){

      // Yes, we have an author with that letter
      noAuthorForThatName = false;

      // Create new Author Div (inside a button)
      var currentAuthorButton = $('<button>');
      var currentAuthorDiv = $('<div>');
      currentAuthorDiv.addClass('author_box centered'); // Added a class
      currentAuthorDiv.attr('data-name', allAuthorsArray[i].lastname + '-' + allAuthorsArray[i].firstname); // Added a Data Attribute (for the other click listener)
          

      // Append Author Image to current div
      var awsAuthorPhotoURL = 'https://s3.amazonaws.com/kean-wwii-scrapbook/author-photos/' + allAuthorsArray[i].lastname.toLowerCase() + '-' + allAuthorsArray[i].firstname.toLowerCase() + '.jpg';
      var currentAuthorImage = $('<img>');
      currentAuthorImage.addClass('author_image'); // Added a class
      currentAuthorImage.attr("src", awsAuthorPhotoURL);
      currentAuthorImage.attr("alt", allAuthorsArray[i].firstname + ' ' + allAuthorsArray[i].lastname);
      currentAuthorDiv.append(currentAuthorImage);


      // Append Footer to current div
      var currentAuthorFooter = $('<h3>');
      currentAuthorFooter.addClass('author_footer'); // Added a class
      currentAuthorFooter.text(allAuthorsArray[i].lastname + ', ' + allAuthorsArray[i].firstname);
      currentAuthorDiv.append(currentAuthorFooter);
      

      // Append into button
      currentAuthorButton.append(currentAuthorDiv)

      // Append current Div to the DOM
      $('#author_list').append(currentAuthorButton);

    } // end if

  } // end for loop


  // If there is no author with that letter, then display message
  if(noAuthorForThatName){
    // Dynamically append message to DOM
    nameInput = nameInput.charAt(0).toUpperCase() + nameInput.slice(1); // proper capitalization of author name
    var noAuthorMessage = $('<h3>Sorry. No author with the lastname "' + nameInput + '" was found.</h3>');
    $('#author_list').append(noAuthorMessage);
  }

}



// Function to append author JSON to DOM on name search
function appendAuthorsByFirstName(nameInput){

  // Test variable for no author found
  var noAuthorForThatName = true;

  // Iterate through JSON
  for(var i=0; i < allAuthorsArray.length; i++){

    // Append if lastname starts with selected letter
    if(allAuthorsArray[i].firstname.toLowerCase() == nameInput){

      // Yes, we have an author with that letter
      noAuthorForThatName = false;

      // Create new Author Div (inside a button)
      var currentAuthorButton = $('<button>');
      var currentAuthorDiv = $('<div>');
      currentAuthorDiv.addClass('author_box centered'); // Added a class
      currentAuthorDiv.attr('data-name', allAuthorsArray[i].lastname + '-' + allAuthorsArray[i].firstname); // Added a Data Attribute (for the other click listener)
          

      // Append Author Image to current div
      var awsAuthorPhotoURL = 'https://s3.amazonaws.com/kean-wwii-scrapbook/author-photos/' + allAuthorsArray[i].lastname.toLowerCase() + '-' + allAuthorsArray[i].firstname.toLowerCase() + '.jpg';
      var currentAuthorImage = $('<img>');
      currentAuthorImage.addClass('author_image'); // Added a class
      currentAuthorImage.attr("src", awsAuthorPhotoURL);
      currentAuthorImage.attr("alt", allAuthorsArray[i].firstname + ' ' + allAuthorsArray[i].lastname);
      currentAuthorDiv.append(currentAuthorImage);


      // Append Footer to current div
      var currentAuthorFooter = $('<h3>');
      currentAuthorFooter.addClass('author_footer'); // Added a class
      currentAuthorFooter.text(allAuthorsArray[i].lastname + ', ' + allAuthorsArray[i].firstname);
      currentAuthorDiv.append(currentAuthorFooter);
      

      // Append into button
      currentAuthorButton.append(currentAuthorDiv)

      // Append current Div to the DOM
      $('#author_list').append(currentAuthorButton);

    } // end if

  } // end for loop


  // If there is no author with that letter, then display message
  if(noAuthorForThatName){
    // Dynamically append message to DOM
    nameInput = nameInput.charAt(0).toUpperCase() + nameInput.slice(1); // proper capitalization of author name
    var noAuthorMessage = $('<h3>Sorry. No author with the firstname "' + nameInput + '" was found.</h3>');
    $('#author_list').append(noAuthorMessage);
  }

}