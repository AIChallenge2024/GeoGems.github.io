const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let hiddenGems = [];

app.post('/add-gem', (req, res) => {
    const gem = req.body;
    hiddenGems.push(gem);
    res.status(200).send('Gem added successfully');
});

app.post('/delete-gem', (req, res) => {
    const { lat, lng } = req.body;
    hiddenGems = hiddenGems.filter(gem => gem.coordinates.lat !== lat || gem.coordinates.lng !== lng);
    res.status(200).send('Gem deleted successfully');
});

// Add a route for the root URL
app.get('/gems', (req, res) => {
    console.log('Sending hidden gems:', hiddenGems);
    res.json(hiddenGems);
});

const options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

https.createServer(options, app).listen(3000, () => {
    console.log('HTTPS Server is running on port 3000');
});



