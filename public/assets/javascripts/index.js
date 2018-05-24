// On Page Load, Fire off page turner code
$(document).ready(function(){

var pageTurned = false;

  // Reload Handler
  if (window.location.hash=="#turn-page") {
    $("#splash-page-image").addClass("pt-page-moveToLeft");
    pageTurned = true;
    $("#float-intro-div").remove();
  }

    // If there is a hash change, then show animation of a page turning
    $(window).on('hashchange',function(){
      $("#splash-page-image").addClass("pt-page-moveToLeft");
      pageTurned = true;
      $("#float-intro-div").remove();
    });


    // If the page is not turned within 5 seconds, tell user to click
    setTimeout(function(){
      if (!pageTurned) {
        alert("Please click the page corner to open the scrapbook.")
      }
    }, 5000);

})
