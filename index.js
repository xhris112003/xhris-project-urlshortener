require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Generate a unique identifier for the short URL
let id = 1;

// Create an empty object to store the URL mappings
const urlMap = {};

// Route handler for creating a short URL
app.post("/api/shorturl", function (req, res) {
  // Retrieve the URL from the request body
  const originalUrl = req.body.url;

  // Check if the URL is valid using a regular expression
  const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Create a short URL using the unique identifier
  const shortUrl = id.toString();

  // Store the URL mapping in the urlMap object
  urlMap[shortUrl] = originalUrl;

  // Increment the identifier for the next URL
  id++;

  // Send the JSON response with the original URL and short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Route handler for redirecting to the original URL
app.get("/api/shorturl/:shortUrl", function (req, res) {
  // Retrieve the short URL parameter from the request
  const shortUrl = req.params.shortUrl;

  // Check if the short URL exists in the urlMap
  if (urlMap.hasOwnProperty(shortUrl)) {
    // Retrieve the original URL from the urlMap
    const originalUrl = urlMap[shortUrl];

    // Redirect the user to the original URL
    res.redirect(originalUrl);
  } else {
    // Send a JSON response with an error message for invalid short URLs
    res.json({ error: "invalid url" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
