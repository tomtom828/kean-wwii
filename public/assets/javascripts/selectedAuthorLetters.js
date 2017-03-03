// On page load, Hit the API and load click listners
$(document).ready(function(){

  // Make letters response global
  var allLetters;

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


  // Append Author Signature to title
  var awsAuthorSignatureURL = 'https://s3.amazonaws.com/tomtom28-kean-wwii/author-signatures/' + displayLastName.toLowerCase() + '-' + displayFirstName.toLowerCase() + '.png';
  $('#author-signature').attr('src', awsAuthorSignatureURL);
  $('#author-signature').attr('alt', displayFirstName + ' ' + displayLastName);


  // Append Author Photo
  var awsAuthorPhotoURL = 'https://s3.amazonaws.com/tomtom28-kean-wwii/author-photos/' + displayLastName.toLowerCase() + '-' + displayFirstName.toLowerCase() + '.jpg';
  $('#author-photo').attr('src', awsAuthorPhotoURL);


  // Append Author name for all needed classes in the body
  $('.author-name').text(displayFirstName + " " + displayLastName);


  // Collect all letters via Author Name (API Call)
  var currentURL = window.location.origin;
  $.get(currentURL + '/api/letters/all/' + lastName + '/' + firstName, function(data){

    // Store repsonse
    allLetters = data;

    //console.log(allLetters)

    // Set the default letter
    $('#currentLetter').text(allLetters[0].filename);

    // Hit API to collect article text
    getLetterText(allLetters[0].filename)

    // Render the proper Letter image
    var letterImageURL = "https://s3.amazonaws.com/tomtom28-kean-wwii/author-archives/" + allLetters[0].filename.toString().replace(/ /g, "+") + "+1-" + allLetters[0].pages + ".jpg";
    $('#letterImage').attr({
      src: letterImageURL,
      alt: allLetters[0].filename.toString()
    });
    $("#lastLetterNumber").html(allLetters[0].pages);

    // Append File Names to the Read Drop Down Menu
    for(var i=0; i < allLetters.length; i++){
      var listItem = '<li class="letterListItem" data-pages="' + allLetters[i].pages + '"><a href="#">' + allLetters[i].filename + '</a></li>';
      $('#letterDropDown').append(listItem);
    }

  });


  // Click Listener for Letter Selection
  $(document).on('click', '.letterListItem', function(e){
    
    // Prevent Default Click action
    e.preventDefault();

    // Collect Image / Letter Entry Name
    var letterName = $(this).text();
    var letterPages = $(this).data("pages");


    // Update Dropdown Button Text
    $('#currentLetter').html(letterName);

    // Render the proper Letter image
    var letterImageURL = "https://s3.amazonaws.com/tomtom28-kean-wwii/author-archives/" + letterName.replace(/ /g, "+") + "+1-" + letterPages + ".jpg";
    console.log(letterImageURL)
    $('#letterImage').attr({
      src: letterImageURL,
      alt: letterName
    });
    $("#lastLetterNumber").html(letterPages);

    // Hit API to collect article text
    getLetterText(letterName);

  });


  // Click Listener for Map Icon Link Selection
  $(document).on('click', '.mapMarkerIconLink', function(e){
    
    // Prevent Default Click action
    //e.preventDefault();

    // Collect Image / Letter Entry Name
    var letterName = $(this).text();

    // Need to manually get the letter pages since the "map_author_letters.js" file is too tangled up
    var letterPages;
    for(var i=0; i<allLetters.length; i++){
      if(allLetters[i].filename == letterName) {
        letterPages = allLetters[i].pages;
      }
    }

    // Update Dropdown Button Text
    $('#currentLetter').html(letterName);

    // Render the proper Letter image
    var letterImageURL = "https://s3.amazonaws.com/tomtom28-kean-wwii/author-archives/" + letterName.replace(/ /g, "+") + "+1-" + letterPages + ".jpg";
    $('#letterImage').attr({
      src: letterImageURL,
      alt: letterName
    });
    $("#lastLetterNumber").html(letterPages);

    // // Hit API to collect article text
    getLetterText(letterName);

  });


  // Click Listener for Left Click on Archive
  $('.glyphicon-menu-left').on('click', function(){

    // Get Current Image SRC
    var currentLetterImageURL = $("#letterImage").attr("src");

    // Split URL to get image file name
    var currentLetterImageName = currentLetterImageURL.split("/");
    currentLetterImageName = currentLetterImageName[5];

    // Split File Name to get end , i.e. "1-x.png"
    var currentLetterImagePosition = currentLetterImageName.split("+");
    var end = currentLetterImagePosition.length - 1;

    // Split File Name to get root image name (ends with a "+")
    var rootLetterImageName = "";
    for(var i=0; i<end; i++){
      rootLetterImageName += currentLetterImagePosition[i] + "+";
    }

    // Split File Name to get current image position
    currentLetterImagePosition = currentLetterImagePosition[end].split("-");
    currentLetterImageNumber = parseInt(currentLetterImagePosition[0]);

    // Split File Name to get last image position
    var lastLetterImageNumber = currentLetterImagePosition[1].split(".jpg");
    lastLetterImageNumber = parseInt(lastLetterImageNumber[0]);

    // Go Back 1 file name only if current postion is greater than 1
    if(currentLetterImageNumber > 1) {
      var newLetterImageURL = "https://s3.amazonaws.com/tomtom28-kean-wwii/author-archives/" + rootLetterImageName + (currentLetterImageNumber - 1) + "-" + lastLetterImageNumber + ".jpg";
      console.log(newLetterImageURL);
      $("#currentLetterNumber").html(currentLetterImageNumber - 1);
      $("#letterImage").attr("src", newLetterImageURL);
    }

  });

  // Click Listener for Right Click on Archive
  $('.glyphicon-menu-right').on('click', function(){

    // Get Current Image SRC
    var currentLetterImageURL = $("#letterImage").attr("src");

    // Split URL to get image file name
    var currentLetterImageName = currentLetterImageURL.split("/");
    currentLetterImageName = currentLetterImageName[5];

    // Split File Name to get end , i.e. "1-x.png"
    var currentLetterImagePosition = currentLetterImageName.split("+");
    var end = currentLetterImagePosition.length - 1;

    // Split File Name to get root image name (ends with a "+")
    var rootLetterImageName = "";
    for(var i=0; i<end; i++){
      rootLetterImageName += currentLetterImagePosition[i] + "+";
    }

    // Split File Name to get current image position
    currentLetterImagePosition = currentLetterImagePosition[end].split("-");
    currentLetterImageNumber = parseInt(currentLetterImagePosition[0]);

    // Split File Name to get last image position
    var lastLetterImageNumber = currentLetterImagePosition[1].split(".jpg");
    lastLetterImageNumber = parseInt(lastLetterImageNumber[0]);

    // Go Forward 1 file name only if current postion is greater than 1
    if(currentLetterImageNumber < lastLetterImageNumber) {
      var newLetterImageURL = "https://s3.amazonaws.com/tomtom28-kean-wwii/author-archives/" + rootLetterImageName + (currentLetterImageNumber + 1) + "-" + lastLetterImageNumber + ".jpg";
      console.log(newLetterImageURL);
      $("#currentLetterNumber").html(currentLetterImageNumber + 1);
      $("#letterImage").attr("src", newLetterImageURL);
    }

  });



  // API Function - Get the Article Text
  var getLetterText = function(letterName){
    // Set up URL to hit API
    var currentURL = window.location.origin;
    $.get(currentURL + "/resources/letters/" + letterName, function(data){
      // Append Text to DOM (note that \n is needed to be changed to <br> tag for jQuery to work right)
      $('#letterText').html( data.replace(/\n/g, "<br />") );
    });
  }




});