// Map Object
var myMap = L.map("map", {
    center: [39.8283, -98.5795], 
    zoom: 4
});

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

// Function to size the circle by magnitude
function sizeCircle(magnitude) {
    return magnitude * 4;
};

// Function to color the circle by depth
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#bd0026";
    }
    else if (depth < 90 && depth >= 70) {
        color = "#f03b20";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#fd8d3c";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#feb24c";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#fed976";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#ffffb2";
    };

    return color;
};

// Access data from link
d3.json(queryUrl).then(data => {
    //console.log(data);

    var depth_array = [];

    // Loop through data
    for (var i = 0; i < features.length; i++) {

        // Define variables from earthquake data
        var latitude = data.geometry[i].coordinates[1];
        var longitude = data.geometry[i].coordinates[0];

        // Define depth & push to an array
        var depth = data.geometry[i].coordinates[2];
        depth_array.push(depth);

        var properties = features[i].properties;

        // Define place & magnitude
        var place = properties.place;
        var magnitude = properties.mag;

        // Current time
        var time = moment(properties.time);

        // Create markers
        circles = L.circleMarker([latitude, longitude], {
            color: "black",
            weight: 1,
            fillColor: colorCircle(depth),
            opactiy: 1,
            fillOpacity: 1,
            radius: sizeCircle(magnitude)
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth} km<br>Time: ${time}`).addTo(myMap);

        // console.log(coordinates);
    };

    // Create info title
    var info = L.control({position: "topright"});

    // Define function when info is added
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "info");
        var title = "<h1>Earthquakes in the Last 7 Days</h1>"
        div.innerHTML = title;

        return div
    };
});
   

  
  