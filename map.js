function initMap(){
    //Map Options
    var options = {
        zoom:13,
        center:{lat:37.98450557467865, lng:23.7275026629592}
    }
    //New Map
    var map = new 
    google.maps.Map(document.getElementById("map"), options);

    //Add Marker Function
    function addMarker(props){
        var marker = new google.maps.Marker({
            position:props.coordinates,
            map:map,
        });

        //Check if icon and content were declared in function
        if (props.iconImage){
            marker.setIcon(props.iconImage)
        }
        if (props.content){
            var infoWindow = new google.maps.InfoWindow({
                content:props.content
            })
        
            marker.addListener("click", function(){
                infoWindow.open(map, marker);
            })
        }
    }
    const gem_icon = {
        url: "https://www.clker.com/cliparts/5/8/7/3/1566560070407030839map-marker-purple.png", // URL to the image
        scaledSize: new google.maps.Size(28, 40)
      };

    const touristic_icon = {
        url: "https://www.pacificcarrentals.com/wp-content/uploads/2020/02/Location.png", // URL to the image
        scaledSize: new google.maps.Size(28, 40)
      };
    addMarker({coordinates:{lat:37.97251240995257, lng:23.72807410862482},iconImage:gem_icon, content:"<h3>Anafiotika</h3>"});
    addMarker({coordinates:{lat:37.977138803582775, lng:23.72290740873045},iconImage:gem_icon, content:"<h3>Ta Karamanlidika tou Fani</h3>"});
    addMarker({coordinates:{lat:37.97149029175632, lng:23.725724793151805}, iconImage:touristic_icon, content:"<h3>Acropolis</h3>"});
    
    //Listen for click on map
    map.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const infobox = document.getElementById("info");
        const infoContent = document.getElementById("info_content");
        infobox.style.display = "block"
        infoContent.innerHTML = `
          <h2>Location Details</h2>
          <p>Latitude: ${lat}</p>
          <p>Longitude: ${lng}</p>
          <p>Additional information can go here.</p>
        `;
      });

      document.getElementById("close_btn").addEventListener("click", () => {
        document.getElementById("info").style.display = "none"; // Hide the info div
      });
}