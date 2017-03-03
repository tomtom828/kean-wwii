// Click Listeners for the Mapping Buttons


function toggle_legend_visibility() {
  var legend = document.getElementById('legend');
  if(legend.style.display == "block") { //if visible, hide it
    legend.style.display = "none";
  }
  else { //if hidden, show it
    legend.style.display = "block";
  }
}


function goto_first_marker() {
  map.setZoom(7);
  current_zoomed_coord_index = 0; //reset current zoomed coord index
  map.panTo(valid_markers[current_zoomed_coord_index].position);
  google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
  document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
}


function goto_final_marker() {
  map.setZoom(7);
  current_zoomed_coord_index = valid_markers.length-1; //reassign current zoomed coord
  map.panTo(valid_markers[current_zoomed_coord_index].position);
  google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
  document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
}


function goto_previous_marker() {
  if(current_zoomed_coord_index === 0 || current_zoomed_coord_index === -1) {
    // if the user navigated to the start of the path, OR has freshly loaded the map and not used the buttons yet, OR reset the map view, wrap around to the end
    map.setZoom(7);
    current_zoomed_coord_index = valid_markers.length-1 //reassign current zoomed coord
    map.panTo(valid_markers[current_zoomed_coord_index].position);
    google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
    document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
  }
  else {
    //the user is somewhere from coords[1] to coords[coords.length-1], so go to previous marker as expected
    map.setZoom(7);
    current_zoomed_coord_index--;
    map.panTo(valid_markers[current_zoomed_coord_index].position);
    google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
    document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";     
  }
}


function goto_next_marker() {
  if(current_zoomed_coord_index === valid_markers.length-1) {
    // if the user navigated to the end of the path, wrap around to the beginning
    map.setZoom(7);
    current_zoomed_coord_index = 0; //reassign current zoomed coord
    map.panTo(valid_markers[current_zoomed_coord_index].position);
    google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
    document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
  }
  else {
    // the user is somwhere from coords[-1] to coords[coords.length-2], go to next as expected
    map.setZoom(7);
    current_zoomed_coord_index++;
    map.panTo(valid_markers[current_zoomed_coord_index].position);
    google.maps.event.trigger(valid_markers[current_zoomed_coord_index],'click');
    document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
  }
}


function reset_map_view() {
  map.setZoom(2);
  map.setCenter(center);
  infoWindow.close();
  document.getElementById("traversal").innerHTML = "Use the buttons below to step through the letters chronologically."; //reset the traversal text
  current_zoomed_coord_index = -1; //reset current zoomed coord index as if the map was freshly loaded
}