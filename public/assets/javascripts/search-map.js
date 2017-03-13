// On Page Load
$(document).ready(function(){


  // Immediately on Page Load
  // ======================================================

  // Load Google Maps (global function)
  initMap();

  var initSearchQuery = '<br><p>Displaying letters written by <b>anyone</b> from <b>any service branch</b> in <b>any year</b>.</p>'
  $('#mapSearchQuery').html(initSearchQuery);



  // Check for a hashed location (i.e. user is returning from Letter Viewer)
  if (window.location.hash != ""){

    // Get the Search that was last viewed
    var searchQuery = window.location.hash;
    searchQuery = searchQuery.slice(1);
    searchQuery = searchQuery.split("+");

    // Ensure there was a full query in url (if not, return and keep init map)
    if(searchQuery.length != 3){
      return;
    }

    // Get the previous parameters
    var branch = searchQuery[0].replace(/\%20/g, " ");
    var sex = searchQuery[1];
    var year = searchQuery[2];
    branch == 'Any' ? branch = '' : branch = branch;
    sex == 'Any' ? sex = '' : sex = sex;
    year == 'All' ? year = '' : year = year;

    // Select Previous Query Drop Downs
    $('#selectedBranch').val(branch);
    $('#selectedSex').val(sex);
    $('#selectedYear').val(year);

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

    // Show Updated Query Terms
    var newSearchQuery = '<br><p>Displaying letters written by <b>' +
      displaySex + '</b> from <b>' +
      displayBranch + '</b> in <b>' + 
      displayYear + '</b>.</p>';
    $('#mapSearchQuery').html(newSearchQuery);


    // Send parameters as an AJAX Post
    var data = {
      branch: branch,
      sex: sex,
      year: year
    }

    $.ajax({
      type: "POST",
      url: '/api/map/search',
      data: data
    })
    // Get Response Back
    .done(function(response){

      // Re run mapping function (global variable from the map-search-letter.js script)
      setTimeout(function(){reInitMap(response)}, 2100); // hacky fix to allow enough time for initMap() to fire

    });

  }




  // Click Listeners
  // ======================================================

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


    // Hash the search parameters
    branch == '' ? branch = 'Any' : branch = branch.replace(/ /g, "%20");
    sex == '' ? sex = 'Any' : sex = sex;
    year == '' ? year = 'All' : year = year;
    window.location.hash = branch + "+" + sex + "+" + year;



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

      // Re run mapping function (global variable from the map-search-letter.js script)
      reInitMap(response);

    });

  });



});