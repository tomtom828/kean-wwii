// On page load, remember the last query
$(document).ready(function(){

  // Read the results query message and pre-select the dropdowns
  var selectedSex = $('#sex-result').text();
  var selectedBranch = $('#branch-result').text();
  var selectedYear = $('#year-result').text();

  // Append the previous Branch selection if not default / unsearched
  if (selectedBranch != 'any service branch' && selectedBranch != '') {

    // Split off the "the" from the response
    selectedBranch = selectedBranch.split("the ");
    selectedBranch = selectedBranch[1];

    // Change the selection to match the last query
    $('#selectedBranch').val(selectedBranch);

  }

  // Append the previous Sex selection if not default / unsearched
  if (selectedSex != 'anyone' && selectedSex != '') {

    // Change men / female to M / F
    if (selectedSex == "women") {
      selectedSex = "F";
    }
    else {
      selectedSex = "M";
    }

    // Change the selection to match the last query
    $('#selectedSex').val(selectedSex);

  }

  // Append the previous Year selection if not default / unsearched
  if (selectedYear != 'any year' && selectedYear != '') {

    // Parse Integer of Year
    selectedYear = parseInt(selectedYear);

    // Change the selection to match the last query
    $('#selectedYear').val(selectedYear);

  }

});