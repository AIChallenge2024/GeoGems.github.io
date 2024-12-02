let clickedCoordinates = {};

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
                content: props.content + `<button onclick="deleteMarker('${props.coordinates.lat}', '${props.coordinates.lng}')">Delete</button>`
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

    // Fetch hidden gems from the server
    fetch('https://localhost:3000/gems')
        .then(response => response.json())
        .then(data => {
            data.forEach(gem => {
                addMarker({ coordinates: gem.coordinates, iconImage: gem_icon, content: `<h3>${gem.name}</h3>` });
            });
        })
        .catch(error => console.error('Error fetching gems:', error));

    map.addListener("click", async (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        clickedCoordinates = { lat: latitude, lng: longitude };

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
                        <h3 data-translate id="underline">${city}, ${country}</h3>
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

    document.getElementById("gem-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const gemName = document.getElementById("gem-name").value;
        const gemType = document.getElementById("gem-type").value;
        const gemDescription = document.getElementById("gem-description").value;

        const formData = new FormData();
        formData.append('name', gemName);
        formData.append('type', gemType);
        formData.append('description', gemDescription);
        formData.append('coordinates', JSON.stringify(clickedCoordinates));

        fetch('https://localhost:3000/add-gem', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Add marker to the map
            addMarker({ coordinates: clickedCoordinates, iconImage: gem_icon, content: `<h3>${gemName}</h3>` });

            document.getElementById("add-gem-form").style.display = "none";
        })
        .catch(error => console.error('Error:', error));
    });
}

function deleteMarker(lat, lng) {
    fetch('https://localhost:3000/delete-gem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Reload the map to reflect the changes
        initMap();
    })
    .catch(error => console.error('Error:', error));
}

window.onload = initMap;