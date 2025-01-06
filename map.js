let clickedCoordinates = {}; 

async function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 37.98450557467865, lng: 23.7275026629592 },
    });
    
    // Function to add markers
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coordinates,
            map: map,
            icon: props.iconImage,
        });
    
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: `${props.content}
                <form method="POST" action="map.php" style="display:inline;">
                    <input type="hidden" name="delete" value="true">
                    <input type="hidden" name="latitude" value="${props.coordinates.lat}">
                    <input type="hidden" name="longitude" value="${props.coordinates.lng}">
                    <button type="submit">Delete</button>
                </form>`
            });
    
            marker.addListener("click", function() {
                infoWindow.open(map, marker);
            });
        }
    }    

    // Marker icon for gems
    const gem_icon = {
        url: "Pictures/map_marker.png",
        scaledSize: new google.maps.Size(28, 40)
    };

    // Add markers for gems loaded from PHP
    if (Array.isArray(gems)) {
        gems.forEach(gem => {
            addMarker({ coordinates: { lat: parseFloat(gem.latitude), lng: parseFloat(gem.longitude) },
                iconImage: gem_icon,
                content: `<h3>${gem.gem_name}</h3>`,
            });
        });
    } else {
        console.error("No gems available or invalid data.");
    }

    // Add marker and populate form on map click
    map.addListener("click", async (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();

        // Populate hidden fields
        const latInput = document.getElementById("latitude");
        const lngInput = document.getElementById("longitude");
        latInput.value = latitude;
        lngInput.value = longitude;

        console.log("Latitude set to:", latInput.value);
        console.log("Longitude set to:", lngInput.value);

        clickedCoordinates = { lat: latitude, lng: longitude };

        const infoDiv = document.getElementById("info");
        const infoContent = document.getElementById("info_content");
        infoContent.innerHTML = `Loading location details...`;
        infoDiv.style.display = "block";

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    const addressComponents = results[0].address_components;
                    const city = addressComponents.find((comp) => comp.types.includes("locality"))?.long_name || "Unknown";
                    const country = addressComponents.find((comp) => comp.types.includes("country"))?.long_name || "Unknown";
                    infoContent.innerHTML = `
                        <h3 id="underline">${city}, ${country}</h3>
                        <button id="add-gem-btn">Add Hidden Gem</button>
                    `;

                    document.getElementById("add-gem-btn").addEventListener("click", () => {
                        document.getElementById("add-gem-form").style.display = "block";
                        infoDiv.style.display = "none";
                    });
                } else {
                    infoContent.innerHTML = `<p>No results found for this location.</p>`;
                }
            } else {
                infoContent.innerHTML = `<p>Geocoder failed: ${status}</p>`;
            }
        });
    });

    // Validate form submission
    document.getElementById("gem-form").addEventListener("submit", (e) => {
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;

        if (!latitude || !longitude) {
            e.preventDefault(); // Prevent form submission
            alert("Please click on the map to select a location before submitting.");
        }
    });

    // Close info panel
    document.getElementById("close_btn").addEventListener("click", () => {
        document.getElementById("info").style.display = "none";
    });

    // Cancel adding a gem
    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("add-gem-form").style.display = "none";
    });
}

window.onload = initMap;
