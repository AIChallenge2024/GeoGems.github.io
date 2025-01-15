let clickedCoordinates = {}; 
let city = "Unknown";
let country = "Unknown";

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
                    <button id="delete-gem-btn" type="submit">Delete</button>
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
        
        clickedCoordinates = { lat: latitude, lng: longitude };

        const infoDiv = document.getElementById("info");
        const infoContent = document.getElementById("info_content");
        infoContent.innerHTML = `Loading location details...`;
        infoDiv.style.display = "block";
    
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, async (results, status) => {
            if (status === "OK" && results[0]) {
                const addressComponents = results[0].address_components;
                const city = addressComponents.find((comp) => comp.types.includes("locality"))?.long_name || "Unknown";
                const country = addressComponents.find((comp) => comp.types.includes("country"))?.long_name || "Unknown";
    
                let aiMessage = `<p>Prompt API not available for use. The AI feature only works in Google Chrome's newest version (64-bit) with the 'Prompt API for Gemini Nano' flag enabled. Enable this flag in chrome://flags if you would like to use AI-powered features. This is because the AI used is from the Google Chrome's Preview Program (it is testing AI specifically used for Google Chrome's Built-in AI Challenge)</p>`;
                if ('ai' in self && 'languageModel' in self.ai) {
                    const capabilities = await self.ai.languageModel.capabilities();
                    if (capabilities.available === "readily" || capabilities.available === "after-download") {
                        const session = await self.ai.languageModel.create({
                            systemPrompt: `You are a knowledgeable assistant that provides concise information. Keep city descriptions to one sentence and each tourist attraction description to two sentences.`
                        });
                        const promptText = `Describe the city ${city} in one sentence (brief description of its culture or landscape). Then, describe its two top tourist attractions, one at a time, each in two sentences. If the city is unknown, describe the country ${country} instead.`;
                        const result = await session.prompt(promptText);
                        aiMessage = `<p>${result}</p>`;
                    }
                }
    
                infoContent.innerHTML = `
                    <h3 id="underline">${city}, ${country}</h3>
                    ${aiMessage}
                    <button id="add-gem-btn">Add Hidden Gem</button>
                `;
    
                document.getElementById("add-gem-btn").addEventListener("click", () => {
                    document.getElementById("add-gem-form").style.display = "block";
                    infoDiv.style.display = "none";
                });
            } else {
                infoContent.innerHTML = `<p>Unable to retrieve location details. Try again.</p>`;
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

async function handlePromptAPI(infoContent) {
    const promptText = `Based on the city: ${city} and/or the country: ${country}, describe the city (or if the city is unknown, describe the country) and its 2 top touristic places.`;

    if ('ai' in self && 'languageModel' in self.ai) {
        try {
            const capabilities = await self.ai.languageModel.capabilities();
            if (capabilities.available === 'readily' || capabilities.available === 'after-download') {
                const session = await self.ai.languageModel.create({
                    systemPrompt: `You are a knowledgeable assistant that provides travel-related information.`,
                });

                if (capabilities.available === 'after-download') {
                    await session.ready;
                }

                const result = await session.prompt(promptText);
                infoContent.innerHTML += `
                    <h2>Location Details</h2>
                    <p>${result}</p>
                `;
            } else {
                infoContent.innerHTML += `<p>Prompt API not available for use.</p>`;
            }
        } catch (error) {
            console.error("Prompt API error:", error);
            infoContent.innerHTML += `<p>Failed to fetch city details. Try again later.</p>`;
        }
    } else {
        infoContent.innerHTML += `<p>Prompt API is not supported in this browser.</p>`;
    }
}

window.onload = initMap;
