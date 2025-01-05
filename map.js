let clickedCoordinates = {};

async function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 37.98450557467865, lng: 23.7275026629592 }
    });

    function addMarker(props) {
        const marker = new google.maps.Marker({
            position: props.coordinates,
            map: map,
            icon: props.iconImage,
        });

        if (props.content) {
            const infoWindow = new google.maps.InfoWindow({
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

    // Add a marker for each gem loaded from PHP
    gems.forEach(gem => {
        addMarker({
            coordinates: { lat: parseFloat(gem.latitude), lng: parseFloat(gem.longitude) },
            iconImage: gem_icon,
            content: `<h3>${gem.gem_name}</h3><p>${gem.gem_description}</p>`
        });
    });

    map.addListener("click", (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        clickedCoordinates = { lat: latitude, lng: longitude };

        // Populate the form with the latitude and longitude values
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;

        const infoDiv = document.getElementById("info");
        const infoContent = document.getElementById("info_content");
        infoContent.innerHTML = `<div id="info_content">This will take a couple of seconds...</div>`;
        infoDiv.style.display = "block";

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    const addressComponents = results[0].address_components;
                    const city = addressComponents.find(component => component.types.includes("locality"))?.long_name || "Unknown";
                    const country = addressComponents.find(component => component.types.includes("country"))?.long_name || "Unknown";
                    infoContent.innerHTML = `
                        <h3 id="underline">${city}, ${country}</h3>
                        <button id="add-gem-btn">Add Hidden Gem</button>
                    `;

                    document.getElementById("add-gem-btn").addEventListener("click", () => {
                        document.getElementById("add-gem-form").style.display = "block";
                        infoDiv.style.display = "none";
                    });
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

    document.getElementById("cancel-btn").addEventListener("click", () => {
        document.getElementById("add-gem-form").style.display = "none";
    });
}

window.onload = initMap;
