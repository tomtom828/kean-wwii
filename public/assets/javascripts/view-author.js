// On Page Load, Hit the API for Letter Text and load click listeners
$(document).ready(function(){


  // Immediately on Page Load
  // ======================================================

  // Load Google Maps (global function)
  initMap();

  // Check for a hashed location (i.e. user is returning from AWS Image Viewer)
  if (window.location.hash != "" && window.location.hash != "#view-letter"){

    // Remove the hash symbol
    var archiveImageHash = window.location.hash;
    archiveImageHash = archiveImageHash.slice(1);

    // Set the previous archive image
    var archiveImageName = "https://s3.amazonaws.com/kean-wwii-scrapbook/archives/" + archiveImageHash + ".jpg";
    $('#letterImage').attr('src', archiveImageName);

    // Update the X of X in View Archive Clickers
    var currentLetterImageNumber = archiveImageHash.split("-");
    currentLetterImageNumber = currentLetterImageNumber[0].slice( (currentLetterImageNumber[0].length - 1) );
    var lastLetterImageNumber = archiveImageHash.slice( (archiveImageHash.length - 1) );
    $("#currentLetterNumber").html(currentLetterImageNumber);
    $('#lastLetterNumber').html(lastLetterImageNumber);

    // Get Filename and Letter Text
    var fileName = archiveImageHash.split("-");
    fileName = fileName[0].slice(0, (fileName[0].length - 2) );;
    fileName = fileName.replace(/\+/g, " ");
    fileName = fileName.trim();
    getLetterText(fileName);

    // Change Dropdown Selection to Filename
    $('#currentLetter').text(fileName);

    // Finally, refresh the hash so all seems at peace in the universe
    window.location.hash = 'view-letter';

  }
  // Otherwise, the default file (first archive) text will be appended via Handlebars



  // Click Listeners
  // ======================================================

  // Click Listener for Letter Selection
  $(document).on('click', '.letterListItem', function(e){

    // Prevent Default Click action
    e.preventDefault();

    // Render Loading Gif before any changes for better user experience
    $('#letterImage').attr({
      src: '/assets/images/Loading.gif',
      alt: 'Loading Archive'
    });

    // Collect Image / Letter Entry Name
    var letterName = $(this).text();
    var letterPages = $(this).data("pages");


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

    // Hit API to collect article text
    getLetterText(letterName);

  });



  // Click Listener for Map Icon Link Selection
  $(document).on('click', '.mapMarkerIconLink', function(e){

    // Added Sexy Scroll to the selected letter
    e.preventDefault();
    $("html, body").animate({ scrollTop: $('#view-letter').offset().top }, 1000);

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
  $('#transcript-button-left').on('click', function(){

    // Get Current Image SRC
    var currentLetterImageURL = $("#letterImage").attr("src");

    // Render Loading Gif before any changes for better user experience
    $('#letterImage').attr({
      src: '/assets/images/Loading.gif',
      alt: 'Loading Archive'
    });

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
    else {
      $("#letterImage").attr("src", currentLetterImageURL);
    }

  });



  // Click Listener for Right Click on Archive
  $('#transcript-button-right').on('click', function(){

    // Get Current Image SRC
    var currentLetterImageURL = $("#letterImage").attr("src");

    // Render Loading Gif before any changes for better user experience
    $('#letterImage').attr({
      src: '/assets/images/Loading.gif',
      alt: 'Loading Archive'
    });

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
    else {
      $("#letterImage").attr("src", currentLetterImageURL);
    }

  });



  // Click Listener to pop out archive image
  // $('#letterImage').on('click', function() {
  //   $('.imagepreview').attr('src', $(this).attr('src'));
  //   $('#imagemodal').modal('show');
  // });

  //document.body.style.zoom = "200%"


  // Archive Double Click ==> View Archive Image on AWS (full screen)
  $( "#letterImage" ).dblclick(function() {

    // Step 1 - Hash the current Selection
    // Get the src of the clicked image
    var archiveImageURL = $(this).attr("src");
    // Parse off most of the URL
    var hashFileName = archiveImageURL.split("/");
    hashFileName = hashFileName[5];
    hashFileName = hashFileName.split(".jpg");
    hashFileName = hashFileName[0];
    // Hash the file name to the URL
    // window.location.hash = hashFileName;
    location.replace("#" + hashFileName);

    // Step 2 - Navigate to AWS
    // Get selected Archive
    var awsImageLink = $("#letterImage").attr("src");
    // var win = window.open(awsImageLink, '_blank');
    var win = window.location = awsImageLink;
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website.');
    }
  });


  // Better for mobile ==> Click link to View Archive Image on AWS (full screen)
  $('#viewFullSizedArchive').on('click', function() {

    // Step 1 - Hash the current Selection
    // Get the src of the clicked image
    var archiveImageURL = $('#letterImage').attr("src");
    // Parse off most of the URL
    var hashFileName = archiveImageURL.split("/");
    hashFileName = hashFileName[5];
    hashFileName = hashFileName.split(".jpg");
    hashFileName = hashFileName[0];
    // Hash the file name to the URL
    // window.location.hash = hashFileName;
    location.replace("#" + hashFileName);

    // Step 2 - Navigate to AWS
    var awsImageLink = $("#letterImage").attr("src");
    // var win = window.open(awsImageLink, '_blank');
    var win = window.location = awsImageLink;
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website.');
    }

  });



  // Archive Double Click ==> View Archive Text on AWS (full screen)
  $('#letterText').dblclick(function() {

    // Step 1 - Hash the current Selection
    // Get the src of the clicked image
    var archiveImageURL = $('#letterImage').attr("src");
    // Parse off most of the URL
    var hashFileName = archiveImageURL.split("/");
    hashFileName = hashFileName[5];
    hashFileName = hashFileName.split(".jpg");
    hashFileName = hashFileName[0];
    // Hash the file name to the URL
    // window.location.hash = hashFileName;
    location.replace("#" + hashFileName);

    // Step 2 - Navigate to AWS
    // Get the File Name from the title
    var fileName = $('#currentLetter').text();
    var awsArchiveTextURL = fileName.replace(/ /g, "%20");
    awsArchiveTextURL = " https://s3.amazonaws.com/kean-wwii-scrapbook/transcripts/" + awsArchiveTextURL + ".txt";
    // Navigate to AWS Link
    var win = window.location = awsArchiveTextURL;
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website.');
    }

  });



  // Better for mobile ==> Click link to View Archive Text on AWS (full screen)
  $('#viewFullSizedTranscribe').on('click', function() {

    // Step 1 - Hash the current Selection
    // Get the src of the clicked image
    var archiveImageURL = $('#letterImage').attr("src");
    // Parse off most of the URL
    var hashFileName = archiveImageURL.split("/");
    hashFileName = hashFileName[5];
    hashFileName = hashFileName.split(".jpg");
    hashFileName = hashFileName[0];
    // Hash the file name to the URL
    // window.location.hash = hashFileName;
    location.replace("#" + hashFileName);

    // Step 2 - Navigate to AWS
    // Get the File Name from the title
    var fileName = $('#currentLetter').text();
    var awsArchiveTextURL = fileName.replace(/ /g, "%20");
    awsArchiveTextURL = " https://s3.amazonaws.com/kean-wwii-scrapbook/transcripts/" + awsArchiveTextURL + ".txt";
    // Navigate to AWS Link
    var win = window.location = awsArchiveTextURL;
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website.');
    }
  });



});



// API Functions
// ======================================================
// Get the Article Text
var getLetterText = function(letterName){

  // Before API call, write loading message
  $('#letterText').html("Loading text...");

  // API call
  $.get('/resources/letters/' + letterName, function(data){

    // Note that /n (enter key) needs to be changed to <br>
    var fileText = data.replace(/\n/g, "<br>");

    // Note that /t (tab key) needs to be changed to a tab, using a <i> tag and CSS
    fileText = fileText.replace(/\t/g, '<i style="padding-left: 5em";></i>');

    // Append Text to DOM
    $('#letterText').html(fileText);

  });
}
