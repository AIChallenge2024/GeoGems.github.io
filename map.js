
async function initMap() {    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom:13,
        center:{lat:37.98450557467865, lng:23.7275026629592}
    });

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
    
    
    map.addListener("click", async (event) => {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      const infoDiv = document.getElementById("info");
      const infoContent = document.getElementById("info_content");
  
      // Show the info div
      infoDiv.style.display = "block";
  
      // Prompt text to detect city based on coordinates
      const promptText = `Given the coordinates latitude: ${latitude} and longitude: ${longitude}, and based on https://www.openstreetmap.org/#map=3/29.15/4.04 (where you can enter those coordinates and see what city they say these coordinates reside in), in which city are those coordinates located?`;
  
      // Check if the Prompt API is available
      if ('ai' in self && 'languageModel' in self.ai) {
        const capabilities = await self.ai.languageModel.capabilities();
        console.log('Capabilities:', capabilities); // Log capabilities
        const available = capabilities.available;
        console.log('Availability:', available); // Log availability
        let session;
  
        if (available === 'readily' || available === 'after-download') {
          session = await self.ai.languageModel.create({
            systemPrompt: `You are a helpful assistant that can determine any city based on geographical coordinates that are inside that city by entering latitude: ${latitude} and longitude: ${longitude} on https://www.openstreetmap.org/#map=3/29.15/4.04 and seeing what they say those coordinates reside in.`
          });
  
          if (available === 'after-download') {
            session.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
            await session.ready;
          }
  
          // Prompt the model
          const result = await session.prompt(promptText);
          console.log('Result:', result); // Log the result
          infoContent.innerHTML = `
            <h2>Location Details</h2>
            <p>${result}</p>
          `;
        } else {
          infoContent.innerHTML = `
            <h2>Location Details</h2>
            <p>Prompt API is not available.</p>
          `;
        }
      } else {
        infoContent.innerHTML = `
          <h2>Location Details</h2>
          <p>Prompt API is not supported in this browser.</p>
        `;
      }
    });
  
    document.getElementById("close_btn").addEventListener("click", () => {
      document.getElementById("info").style.display = "none"; // Hide the info div
    });
  }
  
  window.onload = initMap;
