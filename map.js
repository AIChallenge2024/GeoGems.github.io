async function initMap() {    
  const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: 37.98450557467865, lng: 23.7275026629592 }
  });

  function addMarker(props) {
      var marker = new google.maps.Marker({
          position: props.coordinates,
          map: map,
          icon: props.iconImage,
      });

      if (props.content) {
          var infoWindow = new google.maps.InfoWindow({
              content: props.content
          });

          marker.addListener("click", function() {
              infoWindow.open(map, marker);
          });
      }
  }

  const gem_icon = {
      url: "https://www.clker.com/cliparts/5/8/7/3/1566560070407030839map-marker-purple.png",
      scaledSize: new google.maps.Size(28, 40)
  };

  const touristic_icon = {
      url: "https://www.pacificcarrentals.com/wp-content/uploads/2020/02/Location.png",
      scaledSize: new google.maps.Size(28, 40)
  };

  addMarker({ coordinates: { lat: 37.97251240995257, lng: 23.72807410862482 }, iconImage: gem_icon, content: "<h3>Anafiotika</h3>" });
  addMarker({ coordinates: { lat: 37.977138803582775, lng: 23.72290740873045 }, iconImage: gem_icon, content: "<h3>Ta Karamanlidika tou Fani</h3>" });
  addMarker({ coordinates: { lat: 37.97149029175632, lng: 23.725724793151805 }, iconImage: touristic_icon, content: "<h3>Acropolis</h3>" });

  map.addListener("click", async (event) => {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      const infoDiv = document.getElementById("info");
      const infoContent = document.getElementById("info_content");
      infoContent.innerHTML = `<div id="info_content">This will take a couple of seconds...</div>`;
      infoDiv.style.display = "block";

      // Use Google Maps Geocoding API to get the city
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK") {
              if (results[0]) {
                  const city = results[0].address_components.find(component => component.types.includes("locality")).long_name;
                  infoContent.innerHTML = `
                      <h2>Location Details</h2>
                      <p>City: ${city}</p>
                  `;
              } else {
                  infoContent.innerHTML = `
                      <h2>Location Details</h2>
                      <p>No results found</p>
                  `;
              }
          } else {
              infoContent.innerHTML = `
                  <h2>Location Details</h2>
                  <p>Geocoder failed due to: ${status}</p>
              `;
          }
      });
  });

  document.getElementById("close_btn").addEventListener("click", () => {
      document.getElementById("info").style.display = "none";
  });
}

window.onload = initMap;