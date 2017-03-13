// Takes all Lat & Long from all Letters and puts them on the Google Map


var map; //global ref to google map
var center; //global ref to the center of a map with multiple letters
var valid_markers = []; //only the markers with real location data
var current_zoomed_coord_index = -1; //iterator for stepping through letters in chrono order -- initially at -1, then set to [0,+infinity]


var infoWindow;

// Collect all Lat and Long Points for all letters (and init Google Map with the data)
function initMap() {

  infoWindow = new google.maps.InfoWindow({maxWidth: 200}); //global infowindow for letter info


  // Collect all Lat & Long Points of all letters (API Call)
  $.get('/api/map/search', function(data){

    // Store repsonse
    markers = data;

    // console.log(markers)

    // Author only had 1 letter
    if(markers.length === 1) {

      if(markers[0].lat && markers[0].lng)  {

        // Create Google Map
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
          mapTypeId: 'roadmap'
        });
        
        // Create Legend and Center Map
        createLegend();
        document.getElementById("maperror").style.display = "none";
        center = map.center;
      }

      else {

        document.getElementById("maperror").innerHTML = "Location data is not available at this time.<br>";

        document.getElementById("map").style.display = "none";
        document.getElementById("marker_traveller").style.display = "none";
        document.getElementById("legend").style.display = "none";
        return; //exit early so that the legend div is never created
      }

    }

    // Author had > 1 letter
    else {

      var bound = new google.maps.LatLngBounds();
      var nullcount = 0;

      for(i = 0; i < markers.length; i++) {

        if(markers[i].lat && markers[i].lng) { //if the point is NOT NULL

          bound.extend(new google.maps.LatLng(markers[i].lat, markers[i].lng));
        }

        else { //both the lat and lng are null, meaning we don't have a point to map it to

          nullcount++; //keep track of how many null points there are
        }
      }

      if(nullcount !== markers.length) { //if there is at least one non-null point, make the map object

        // Create Google Map
        map = new google.maps.Map(document.getElementById("map"), {
          center: bound.getCenter(),
          zoom: 2,
          mapTypeId: 'roadmap'
        }); //create map, center is derived from latlngbounds

        // Create Legend and Center Map
        createLegend();
        center = bound.getCenter(); //store center in a global
        document.getElementById("maperror").style.display = "none";
      }

      else { //nullcount === markers.length, which means every point for the author was null, so DO NOT draw the map

        document.getElementById("maperror").innerHTML = "Location data is not available at this time.<br>";

        document.getElementById("map").style.display = "none";
        document.getElementById("marker_traveller").style.display = "none";
        document.getElementById("legend").style.display = "none";
        return; //exit early so that the legend div is never created
      }

  }


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

  });


  // Create a Custom Map Legend
  function createLegend(){

    var legend = document.getElementById('legend');
    legend.style.display = "block"; //toggle visibility here, when it's known the legend will actually be needed 
    
    var prefixes = ["unknown","1941","1942","1943","1944","1945","1946","1950"];

    for(var i = 0; i < prefixes.length; i++) {

      var single_icon = "/map/marker_icons/" + prefixes[i] + "_single.png";
      var multiple_icon = "/map/marker_icons/" + prefixes[i] + "_multiple.png";

      var single_name = prefixes[i] + " (single)";
      var multiple_name = prefixes[i] + " (multiple)";

      var div = document.createElement('div');

      div.innerHTML = '<img src="' + single_icon + '"> ' + single_name + '<img src="' + multiple_icon + '"> ' + multiple_name;
      legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend); //push the filled legend div to the map
  }

}