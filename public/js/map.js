document.addEventListener(
  'DOMContentLoaded',
  () => {
    function createMarker(center, map, title) {
      new google.maps.Marker({
        position: center,
        map,
        title,
      });
    }

    function validationTravelMode(travelMode) {
      const travelModes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];
      if (!travelModes.includes(travelMode)) {
        throw new Error(`travelMode no es válido, solo son ${travelModes}`);
      }
    }

    function direction(map, { origin, destination, travelMode }) {
      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();

      validationTravelMode(travelMode);
      const directionRequest = {
        origin,
        destination,
        travelMode,
      };

      directionsService.route(directionRequest, function (response, status) {
        if (status === 'OK') {
          // everything is ok
          console.log(response);
          directionsDisplay.setDirections(response);
        } else {
          // something went wrong
          window.alert('Directions request failed due to ' + status);
        }
      });

      directionsDisplay.setMap(map);
    }

    function geocode(map) {
      if (navigator.geolocation) {
        // Get current position
        // The permissions dialog will pop up
        navigator.geolocation.getCurrentPosition(
          function (position) {
            // Create an object to match Google's Lat-Lng object format
            const center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            createMarker(center, map, 'Mi posición!!');
            // User granted permission
            // Center the map in the position we got
          },
          function () {
            // If something goes wrong
            console.log('Error in the geolocation service.');
          }
        );
      } else {
        // Browser says: Nah! I do not support this.
        console.log('Browser does not support geolocation.');
      }
    }


    function placeRestaurants(restaurants, map) {
      for (let restaurant of restaurants) {
        const center = {
          lat: restaurant.location.coordinates[1],
          lng: restaurant.location.coordinates[0],
        };
        createMarker(center, map, restaurant.name);
      }
    }

    function getRestaurants(map) {
      axios
        .get('/restaurants/api')
        .then((response) => {
          placeRestaurants(response.data, map);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function startMap() {
      let ironhack = {
        lat: 41.3977381,
        lng: 2.190471916,
      };

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: ironhack,
      });
      direction(map, {
        origin: ironhack,
        destination: 'Madrid, ES',
        travelMode: 'WALKING',
      });
      geocode(map);
      getRestaurants(map);
    }

    startMap();
  },
  false
);
