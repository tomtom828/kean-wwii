// Takes Lat & Long from Search Results and puts them on the Google Map (clears old markers)

function reInitMap(data){

  // Delete Current Markers (global variable from other JS script)
  for (var i = 0; i < valid_markers.length; i++) {
    valid_markers[i].setMap(null);
  }
  valid_markers.length = 0;
  current_zoomed_coord_index = -1;


  // Re Build Markers using new data
  var markers = data;

  // Global Info Window
  infoWindow = new google.maps.InfoWindow({
    maxWidth: 200
  });

  // Reset Map View
  reset_map_view();

  // Reset Error Message (if any)
  $('#searchNotFound').text('');


  // Check if there are no letters from the search
  if (markers.length == 0) {
    // Nothing was found, so show show the error messsage
    $('#searchNotFound').text('Sorry no letters were found for this criteria.')
    return;
  }



  // Over Lap Functions
  var oms = new OverlappingMarkerSpiderfier(map,{
    keepSpiderfied: true
  });

    var spider_infowindow = new google.maps.InfoWindow({maxWidth: 200});

    /* Not needed -- let the google maps API infowindow control clicks instead for now
    oms.addListener('click', function(marker, event) {
      iw.setContent(marker.desc);
      iw.open(map, marker);
      }); */

    oms.addListener('spiderfy',function(markers) {
      spider_infowindow.close();
    })

    var distinct_array = {};

    for(i = 0; i < markers.length; i++) {
      //get distinct marker lat/lng combos
      if(markers[i].lat && markers[i].lng) {

        var coords = markers[i].lat+","+markers[i].lng;
        if(distinct_array[coords])
          distinct_array[coords]++;
        else
          distinct_array[coords] = 1;
      }
    }

    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };

    var chronocounter = 0;

    for(var i = 0; i < markers.length; i++) {

      if(markers[i].lat && markers[i].lng) { //if the map point exists

        chronocounter++;

        var coords = markers[i].lat+","+markers[i].lng;

        var name = markers[i].filename;
        var address = markers[i].location;
        var point = new google.maps.LatLng(
          parseFloat(markers[i].lat),
          parseFloat(markers[i].lng));
        var letterid = markers[i].id;
        var year = markers[i].ts_dateguess.substring(0, 4);;

        // *** NEW BY TOMMY ***
        var letterURL = "/view/letter/" + name.replace(/ /g, "%20");

        if(year > "0000") { //if a year is not null, by default make the path point to that year, single icon on the spot

          var marker_icon_filepath = "/map/marker_icons/" + year.toString() + "_single.png";
        }

        else { //year is unknown

          var marker_icon_filepath = "/map/marker_icons/unknown_single.png";
        }

        var html = '<b><a href="' + letterURL + '" class="mapMarkerIconLink">' + 
                    name + '</a>'+ 
                    '</b> <br>' + 
                    address +
                    '<br>';
        var icon = {};

        //change this to generate string that points to proper marker, then use that in the icon -> we can go from this to use normal markers instead of MarkerWithLabel
        //year maps to color - add year to getxml so that we can easily pull it like the data above
        //order maps to marker content - use chronocounter in the string generation
        //remove the above var icon, and directly point to the generated string instead
        //problem: this approach doesn't map density -- may need colored *and* shaped marker

        //when this works, build a legend for the map

        var marker = new MarkerWithLabel({
          map: map,
          position: point,
          icon: marker_icon_filepath,
          name: name,
          labelAnchor: new google.maps.Point(3,27),
          year: year,
          chronoSpot: chronocounter //label markers with the order they appear (chronologically)
        });

        if(chronocounter >= 10) { //slightly move the anchor to make 2-digit counters appear well

          marker.setOptions({
            labelAnchor: new google.maps.Point(6,27)
          });
        }

      //if the points are going to be spiderfied, add them to the oms instance
      //this conditional weeds out points that fall on the same spot

      if(distinct_array[coords] > 1) {
        oms.addMarker(marker);
        
        if(year > "0000") {
          marker.setOptions({
            icon: "/map/marker_icons/" + year.toString() + "_multiple.png"
          }); 
        }

        else {
          marker.setOptions({
            icon: "/map/marker_icons/unknown_multiple.png"
          });
        } 
      }

      valid_markers.push(marker);
      
      bindInfoWindow(marker, map, infoWindow, html); //bind ALL points to the google.maps.event

      } //endif
    } //end marker loop

   document.getElementById("traversal").innerHTML = "Use the buttons below to step through the letters chronologically.";


      // OTHER FUNCTIONS FOR MAPPNG
      function create_polyline_listeners(polyline, label) {

        google.maps.event.addListener(polyline, 'mouseover', function(e) {

            var tooltipLat = e.latLng.lat();
            var tooltipLng = e.latLng.lng();
            label.position = new google.maps.LatLng(tooltipLat, tooltipLng);
            //label.position = e.latLng;

            label.setMap(map);
            
            polyline.setOptions({ strokeColor: '#660033',
                                  strokeWeight: 6});  
        });

        google.maps.event.addListener(polyline, 'mouseout', function(e) {

            label.setMap(null);
            polyline.setOptions({ strokeColor: '#2f2f2f',
                                  strokeWeight: 4});  
        });
      }


      function bindInfoWindow(marker, map, infoWindow, html) {

        google.maps.event.addListener(marker, 'click', function() {

          infoWindow.setContent(html);
          infoWindow.open(map,marker);

          //extra code to bind the map navigation to marker clicks
          current_zoomed_coord_index = marker.chronoSpot-1; //-1 for 0-indexing
          document.getElementById("traversal").innerHTML = "Letter " + (current_zoomed_coord_index+1) + " of " + valid_markers.length + " (chronologically)";
        });
      }







}







