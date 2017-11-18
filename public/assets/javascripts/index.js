// On Page Load, Render
$(document).ready(function(){

  $("#kean-wwii-content").remove();


  // Page refresh handler, if "#select" page was refreshed
  if (window.location.hash != "") {

    // Remove splashpage
    $("#index-content").empty();

    // Add Cursive Links
    addIndexContent();

  }
  else {

    // If there is a hash change, then render the cursive links
    $(window).on('hashchange',function(){

      // Animation of a page turning
      $("#index-content").empty();

      // Add Cursive Links
      addIndexContent();

    });

  }


  // Adds cursive links to Page
  function addIndexContent(){

    // Render Content for Cursive Links
    var content = '<h1 class="a"><a class="hide_hyperlink" href="/reading">Reading the Scrapbook</a></h1>' +
      '<h1 class="b"><a class="hide_hyperlink" href="#">Experiencing WWII</a></h1>' +
      '<h1 class="c"><a class="hide_hyperlink" href="#">Scrapbooking the War</a></h1>' +
      '<h1 class="d"><a class="hide_hyperlink" href="#">Teaching WWII</a></h1>' +
      '<h1 class="e"><a class="hide_hyperlink" href="#">Doing History</a></h1>';
    $("#index-content").append(content);

  }

})
