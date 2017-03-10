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


});