// On Page Load, Hit the API for Letter Text and load click listeners
$(document).ready(function(){


  // Immediately on Page Load
  // ======================================================

  // Get the default letter selection
  var defaultFileName = $('#currentLetter').text();

  // Then, Hit the API to collect article text
  getLetterText(defaultFileName)



  // Click Listeners
  // ======================================================

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
    var letterImageURL = "https://s3.amazonaws.com/kean-wwii-scrapbook/archives/" + letterName.replace(/ /g, "+") + "+1-" + letterPages + ".jpg";
    console.log(letterImageURL)
    $('#letterImage').attr({
      src: letterImageURL,
      alt: letterName
    });
    $("#currentLetterNumber").html(1);
    $("#lastLetterNumber").html(letterPages);

    // Hit API to collect article text
    getLetterText(letterName);

  });



  // Click Listener for Map Icon Link Selection
  $(document).on('click', '.mapMarkerIconLink', function(e){
    
    // No Prevent Default Click action b/c we want it to scroll up
    // e.preventDefault();

    // Collect Image / Letter Entry Name
    var letterName = $(this).text();  

    // Need to pull letter pages from dropdown since the "map_author_letters.js" file is too tangled up
    var letterPages = $('a:contains("' + letterName + '")').data('pages');

    // Update Dropdown Button Text
    $('#currentLetter').html(letterName);

    // Render the proper Letter image
    var letterImageURL = "https://s3.amazonaws.com/kean-wwii-scrapbook/archives/" + letterName.replace(/ /g, "+") + "+1-" + letterPages + ".jpg";
    $('#letterImage').attr({
      src: letterImageURL,
      alt: letterName
    });
    $("#currentLetterNumber").html(1);
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
      var newLetterImageURL = "https://s3.amazonaws.com/kean-wwii-scrapbook/archives/" + rootLetterImageName + (currentLetterImageNumber - 1) + "-" + lastLetterImageNumber + ".jpg";
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
      var newLetterImageURL = "https://s3.amazonaws.com/kean-wwii-scrapbook/archives/" + rootLetterImageName + (currentLetterImageNumber + 1) + "-" + lastLetterImageNumber + ".jpg";
      console.log(newLetterImageURL);
      $("#currentLetterNumber").html(currentLetterImageNumber + 1);
      $("#letterImage").attr("src", newLetterImageURL);
    }

  });

});



// API Functions
// ======================================================
// Get the Article Text
var getLetterText = function(letterName){
  $.get('/resources/letters/' + letterName, function(data){
    // Append Text to DOM (note that \n is needed to be changed to <br> tag for jQuery to work right)
    $('#letterText').html( data.replace(/\n/g, "<br />") );
  });
}
