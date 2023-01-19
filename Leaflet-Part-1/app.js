// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(data => {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// create function based on depth of the earthquake
function colorWheel(depth) {
  if (depth > 90) 
    return '#fc4e2a';
  else if (depth > 70) 
    return '#fd8d3c';
  else if (depth > 50) 
    return '#feb24c';
  else if (depth > 30) 
    return '#fed976';
  else if (depth > 10) 
    return '#d9f0a3';
  else 
    return '#addd8e';
}

function styleInfo(feature) {
  return {
    radius: markerSize(feature.properties.mag),
    color: 'black',
    fillColor: colorWheel(feature.geometry.coordinates[2]),
    weight: 0.5,
    fillOpacity: 0.8,
    stroke: true
  }
}
//create marker size function
  function markerSize(mag) {
    return Math.sqrt(mag) * 10;
  }


function createFeatures(earthquakeData) {


    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
        styleInfo(feature)
        );
      }
    });

    // Send our earthquakes layer to the createMap function/
      createMap(earthquakes);
  }

  function createMap(earthquakes) {


    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };


    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };


    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });


    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  



 // Set up the legend.
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var limits = [-10, 10, 30, 50, 70, 90];;
   var colors = ['#fc4e2a', '#fd8d3c', '#feb24c', '#fed976', '#d9f0a3', '#addd8e'];
   var labels = [];


   // Add the minimum and maximum.
   var legendInfo = "<h1>Depth of Earthquake<br />km</h1>"+
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
     "</div>";


   div.innerHTML = legendInfo;


   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });


   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };


 // Adding the legend to the map
    legend.addTo(myMap);
}