// Function to size the circle by magnitude
function circleSize(magnitude) {
    return magnitude*5;
};

// Function to color the circle by depth
function circleColor(depth) {
    if (depth >= 90) {
        color = "#E23B3E";
    }
    else if (depth < 10 && depth >= 0) {
        color = "#577590";
    }
    else if (depth < 20 && depth >= 10) {
        color = "#4D908E";
    }
    else if (depth < 30 && depth >= 20) {
        color = "#6FA77E";
    }
    else if (depth < 40 && depth >= 30) {
        color = "#90BE6D";
    }
    else if (depth < 50 && depth >= 40) {
        color = "#C5C35E";
    }
    else if (depth < 60 && depth >= 50) {
        color = "#F9C74F";
    }
    else if (depth < 70 && depth >= 60) {
        color = "#F8961E";
    }
    else if (depth < 80 && depth >= 70) {
        color = "#F3722C";
    }
    else if (depth < 90 && depth >= 80) {
        color = "#EB5735";
    };
    return color;
};

// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(data => {

  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

  // Set up the legend.
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Depth of Earthquake</h1>" +
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
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            opacity: 1,
            fillOpacity: 1,
            fillColor: circleColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: circleSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        });
      } 
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };

  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
  
  }
  
  
