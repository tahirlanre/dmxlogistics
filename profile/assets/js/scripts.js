const markers = [];

const clearMarkers = () => {
  if (markers[0]) {
    markers.map(e => e.setMap(null));
  }
};

const placeMarkerAndPanTo = (latLng, map) => {  
  const marker = new google.maps.Marker({
    position: latLng,
    map,
  });  
  map.panTo(latLng);
  markers.push(marker);
};

function initMap() {
  let map = document.querySelector('#map');
 
    map = new google.maps.Map(map, {
      zoom: 13,
      center: {
        lat: 6.605874,
        lng: 3.349149,
      },
    });

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
  
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    map.addListener('click', (e) => {
      // let latLng = `(${x.latLng.lat()}, ${x.latLng.lng()})`;
      // e.nextElementSibling.value = latLng;
      clearMarkers();            
      placeMarkerAndPanTo(e.latLng, map);
      geocodeLatLng(e.latLng);
    })
}

function geocodeLatLng(latLng) {
  const geocoder = new google.maps.Geocoder;
  var latlngStr = String(latLng).split(',', 2);

  var latlng = { lat: parseFloat(latlngStr[0].substr(1)), lng: parseFloat(latlngStr[1]) };

  geocoder.geocode({ 'location': latlng }, function(results, status) {
    if (status === 'OK') {
        if (results[0]) {
            // address.innerHTML = results[0].formatted_address;
            console.log(results[0].formatted_address);
        } else {
            // address.innerHTML = 'Location Address not Available';
            console.log('Location Address not Available');
            
        }
    } else {
        console.log('Place not found');
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

var placeSearch, autocomplete;

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'), {types: ['geocode']});
  initMap();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      autocomplete.setBounds(circle.getBounds());
    });
  }
}