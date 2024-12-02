const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let hiddenGems = [];

app.post('/add-gem', upload.none(), (req, res) => {
    const gem = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        coordinates: JSON.parse(req.body.coordinates)
    };
    hiddenGems.push(gem);
    res.status(200).send('Gem added successfully');
});

app.post('/delete-gem', (req, res) => {
    const { lat, lng } = req.body;
    hiddenGems = hiddenGems.filter(gem => gem.coordinates.lat !== lat || gem.coordinates.lng !== lng);
    res.status(200).send('Gem deleted successfully');
});

app.get('/gems', (req, res) => {
    res.json(hiddenGems);
});

// Add a route for the root URL
app.get('/', (req, res) => {
    res.send('Server is running');
});

const options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

https.createServer(options, app).listen(3000, () => {
    console.log('HTTPS Server is running on port 3000');
});