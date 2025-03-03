<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
include 'mysql_info.php';

$conn = new mysqli($hostname, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission for gem addition
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['gem-name']) && isset($_POST['gem-type']) && isset($_POST['gem-description'])) {
    $gem_name = $conn->real_escape_string($_POST['gem-name']);
    $gem_type = $conn->real_escape_string($_POST['gem-type']);
    $gem_description = $conn->real_escape_string($_POST['gem-description']);
    $latitude = $conn->real_escape_string($_POST['latitude']);
    $longitude = $conn->real_escape_string($_POST['longitude']);

    if (!$latitude || !$longitude) {
        die("Latitude or longitude not received correctly. POST data: " . print_r($_POST, true));
    }

    $sql = "INSERT INTO hidden_gems (gem_name, gem_type, gem_description, latitude, longitude)
            VALUES ('$gem_name', '$gem_type', '$gem_description', '$latitude', '$longitude')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Record inserted successfully.');</script>";
    } else {
        echo "Error: " . $conn->error;
    }
}

// Handle gem deletion
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['delete']) && $_POST['delete'] === 'true') {
    $latitude = $conn->real_escape_string($_POST['latitude']);
    $longitude = $conn->real_escape_string($_POST['longitude']);

    if (!$latitude || !$longitude) {
        echo "<script>alert('Latitude or longitude not received correctly.');</script>";
    } else {
        $sql = "DELETE FROM hidden_gems WHERE latitude = ? AND longitude = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $latitude, $longitude);

        if ($stmt->execute()) {
            // After deleting, reload the page to reflect the changes
            echo "<script>alert('Gem deleted successfully!'); window.location.href='map.php';</script>";
        } else {
            echo "<script>alert('Failed to delete gem.'); window.location.href='map.php';</script>";
        }

        $stmt->close();
    }
}

// Fetch gems from the database
$sql = "SELECT gem_name, gem_description, latitude, longitude FROM hidden_gems";
$result = $conn->query($sql);

$gems = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $gems[] = $row;
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map</title>
    <link rel="stylesheet" href="nav_bar.css">
    <link rel="icon" href="https://avatars.githubusercontent.com/u/188487384?s=400&u=47e89d2ae74714e87930889b618f5e64d41af4fa&v=4" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="map.css">
    <script src="apikey.js"></script>
    <script>
        document.write('<script src="' + apikey + '" async defer><\/script>');
    </script>
    <script>
        // Pass PHP data to JavaScript
        const gems = <?php echo json_encode($gems); ?>;
    </script>
    <script src="map.js?v=<?=filemtime('map.js');?>" defer></script>
</head>
<body>
    <nav class="navbar">
        <input type="checkbox" id="check">
        <label for="check" class="checkbtn">
            <i class="fas fa-bars"></i>
        </label>
        <img class="logo" src="Pictures/logo_with_title.png" alt = logo style="width:75px;height:80px;margin-left: 50px;"/>
        <ul>
            <li><a href="home.html">Home</a></li>
            <li ><a href="map.php">Map</a></li>
            <li><a href="hidden_gems.php">Hidden Gems</a></li>
            <li><a href="about_us.html">About us</a></li>
            <li><a href="log_in.html" class="purple_btn">Log in</a></li>
            <li><a href="sign_up.html" class="purple_btn">Sign up</a></li>
        </ul>
    </nav>
    <div id="map-container">
        <div id="map"></div>
        <div id="info">
            <button id="close_btn">&times;</button>
            <div id="info_content">This will take a couple of seconds...</div>
        </div>
        <div id="add-gem-form" style="display:none;">
            <h3 style="text-decoration: underline; margin-bottom: .5rem;">Add Hidden Gem</h3>
            <form id="gem-form" action="/map.php" method="POST">
                <label for="gem-name">Name:</label>
                <input type="text" id="gem-name" name="gem-name" required><br>
                <label for="gem-type">Type:</label>
                <input type="text" id="gem-type" name="gem-type" required><br>
                <label for="gem-description">Description:</label>
                <textarea id="gem-description" name="gem-description" required  maxlength="250"></textarea><br>
                <input type="hidden" id="latitude" name="latitude">
                <input type="hidden" id="longitude" name="longitude">
                <button type="submit">Submit</button>
            </form>
            <button id="cancel-btn">Cancel</button>
        </div>
    </div>
</body>
</html>
