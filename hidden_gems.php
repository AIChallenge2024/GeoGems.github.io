<?php
// Database connection
include 'mysql_info.php';

$conn = new mysqli($hostname, $username, $password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch gems from the database
$sql = "SELECT gem_name, gem_type, gem_description FROM hidden_gems";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hidden Gems</title>
    <link rel="stylesheet" href="nav_bar.css">
    <link rel="icon" href="https://avatars.githubusercontent.com/u/188487384?s=400&u=47e89d2ae74714e87930889b618f5e64d41af4fa&v=4" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="hidden_gems.css">
</head>
<body>
    <nav class="navbar">
        <input type="checkbox" id="check">
        <label for="check" class="checkbtn">
            <i class="fas fa-bars"></i>
        </label>
        <img class="logo" src="Pictures/logo_with_title.png" alt = logo style="width:75px;height:80px;margin-left: 50px;"></img>
        <ul>
            <li><a href="home.html">Home</a></li>
            <li><a href="map.php">Map</a></li>
            <li><a href="hidden_gems.php">Hidden Gems</a></li>
            <li><a href="about_us.html">About us</a></li>
            <li><a href="log_in.html" class="purple_btn">Log in</a></li>
            <li><a href="sign_up.html" class="purple_btn">Sign up</a></li>
        </ul>
    </nav>
    <section>
        <style>
            .light-text {
              font-weight: 450; /* Lighter text */
            }
          </style>
          <!-- This will be dynamically updated to include the city name -->
        <h1 class="light-text" style= "font-family: montserrat; font-size: 40px; padding-left: 180px; padding-top: 50px;">Athen’s hidden gems</h1>
        <div class="button-container">
                </style>
                </head>
                <body>
                    <div class="wrapper">
                    <div id="search-container">
                        <input
                          type="search"
                          id="search-input"
                          placeholder="Search product name here.."
                        />
                        <button id="search">Search</button>
                      </div>
                    <div id="buttons">
                        <button class="button-value" onclick="filterLocation('Nature & Parks')">Nature & Parks</button>
                        <button class="button-value" onclick="filterLocation('Museums')">Museums</button>
                        <button class="button-value" onclick="filterLocation('Sights & Landmarks')">Sights & Landmarks</button>
                        <button class="button-value" onclick="filterLocation('Restaurants')">Restaurants</button>
                        <button class="button-value" onclick="filterLocation('Attractions')">Attractions</button>
                    </div>
                    <div id="locations"></div>
                </div>
                </body>
        </div>
                      
          <p style="margin-top: 50px; margin-left: 180px;">26 results</p>
          <hr style="border: 1px solid #000; margin: 20px 0; margin-left: 180px; margin-right: 180px; margin-top: 5px;">
            <div id="gems-container">
                <div class="flex-box">
                    <img src="Pictures/anafiotika.png">
                    <!--save button-->
                <button class="save-button" href="go-to-somehwere-else">
                    <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                </button>
                    <div class="hgb-content">
                        <h3>Anafiotika</h3>
                        <p style="font-weight: bold;">Nature park</p>
                        <hr>
                        <p>Nestled at the north slope of the Acropolis, Anafiotika is one of Athens’ most scenic neighborhoods. Lined with white-washed houses resembling the Cycladic architecture design, this district looks nothing like the Greek capital.</p>
                    </div>
                </div>
                <div class="flex-box">
                    <img src="Pictures/Acropolis3.jpg">
                    <!--save button-->
                <button class="save-button" href="go-to-somehwere-else">
                    <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                </button>
                    <div class="hgb-content">
                        <h3>Acropolis</h3>
                        <p style="font-weight: bold;">Historical site</p>
                        <hr>
                        <p>Perched on a rocky hill, the Acropolis of Athens is home to iconic structures like the Parthenon, showcasing the grandeur of 5th-century BCE classical architecture.</p>
                    </div>
                </div>   
                <div class="flex-box">
                    <img src="Pictures/garden.jpg">
                    <!--save button-->
                <button class="save-button" href="go-to-somehwere-else">
                    <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                </button>
                    <div class="hgb-content">
                        <h3>National Garden</h3>
                        <p style="font-weight: bold;">Nature park</p>
                        <hr>
                        <p>The National Garden of Athens is a serene public park near Syntagma Square, offering lush greenery, ancient ruins, and a peaceful escape.</p>
                    </div>
                </div>   
                <div class="flex-box">
                    <img src="Pictures/theatre.png">
                    <!--save button-->
                <button class="save-button" href="go-to-somehwere-else">
                    <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                </button>
                    <div class="hgb-content">
                        <h3>Dionysus Theatre </h3>
                        <p style="font-weight: bold;">Theater</p>
                        <hr>
                        <p>The Theatre of Dionysus, on the Acropolis’ southern slope, is the birthplace of Greek drama and a symbol of ancient cultural excellence.</p>
                    </div>
                </div>    
                <div class="flex-box">
                    <img src="Pictures/museum.jpg">
                    <!--save button-->
                <button class="save-button" href="go-to-somehwere-else">
                    <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                </button>
                    <div class="hgb-content">
                        <h3>EMST</h3>
                        <p style="font-weight: bold;">Museum</p>
                        <hr>
                        <p>The National Museum of Contemporary Art (EMST) in Athens showcases modern works in a striking building, promoting dialogue through diverse exhibitions.</p>
                    </div>
                </div>  
                <?php
                if ($result && $result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $name = htmlspecialchars($row['gem_name']);
                        $type = htmlspecialchars($row['gem_type']);
                        $description = htmlspecialchars($row['gem_description']);
                        echo '
                        <div class="flex-box">
                            <img src="Pictures/generic_travel.png" alt="Gem Image">
                            <button class="save-button" href="go-to-somewhere-else">
                                <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                            </button>
                            <div class="hgb-content">
                                <h3>' . $name . '</h3>
                                <p style="font-weight: bold;">' . $type . '</p>
                                <hr>
                                <p>' . $description . '</p>
                            </div>
                        </div>';
                    }
                }
                ?>
            </div> 
    </section>
    <!-- button library thing-->
    <script src="hidden_gems.js"></script>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <script>
    fetch('https://localhost:3000/gems')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched gems:', data); // Log the fetched data
            const gemsList = document.getElementById('gems-container');
            data.forEach(gem => {
                const gemDiv = document.createElement('div');
                gemDiv.classList.add('flex-box'); // Add the flex-box class
                gemDiv.innerHTML = `
                    <img src="Pictures/generic_travel.png">
                    <!--save button-->
                    <button class="save-button" href="go-to-somehwere-else">
                        <ion-icon name="bookmark-sharp" size="large" style="border-color: #000;"></ion-icon>
                    </button>
                    <div class="hgb-content">
                        <h3>${gem.name}</h3>
                        <p style="font-weight: bold;">${gem.type}</p>
                        <hr>
                        <p>${gem.description}</p>
                    </div>
                `;
                gemsList.appendChild(gemDiv);
            });
        })
        .catch(error => console.error('Error fetching gems:', error));
    </script>
</body>
</html>
