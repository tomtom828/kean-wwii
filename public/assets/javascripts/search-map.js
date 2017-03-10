// On Page Load
$(document).ready(function(){


  // Immediately on Page Load
  // ======================================================
  var initSearchQuery = '<br><p>Displaying letters written by <b>anyone</b> from <b>any service branch</b> in <b>any year</b>.</p>'
  $('#mapSearchQuery').html(initSearchQuery);



  // Click Listeners
  // ======================================================

  // Click Listener for Map Icon Link Selection
  $(document).on('click', '.mapMarkerIconLink', function(e){
    
    console.log('clicked map icon')
    
  });


  // Click Listener for Map Search Bar
  $('#submitMapSearch').on('click', function(){

    // Grab search parameters
    var branch = $('#selectedBranch').val();
    var sex = $('#selectedSex').val();
    var year = $('#selectedYear').val();

    var data = {
      branch: branch,
      sex: sex,
      year: year
    }

    // Clean query terms
    var displaySex;
    if (sex == "F") {
      displaySex = "women";
    }
    else if (sex == "M") {
      displaySex = "men";
    }
    else {
      displaySex = "anyone";
    }

    var displayBranch;
    if (branch == "") {
      displayBranch = "any service branch";
    }
    else {
      displayBranch = "the " + branch;
    }

    var displayYear;
    if (year == "") {
      displayYear = "any year";
    }
    else {
      displayYear = year;
    }

    // Send parameters as an AJAX Post
    $.ajax({
      type: "POST",
      url: '/api/map/search',
      data: data
    })
    // Get Response Back
    .done(function(response){

      // Show Updated Query Terms
      var newSearchQuery = '<br><p>Displaying letters written by <b>' +
        displaySex + '</b> from <b>' +
        displayBranch + '</b> in <b>' + 
        displayYear + '</b>.</p>';
      $('#mapSearchQuery').html(newSearchQuery);

      // Re run mapping function
      console.log(response)

      reInitMap(response);

    });

  });



});