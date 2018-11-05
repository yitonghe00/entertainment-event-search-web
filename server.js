const express = require("express");
const https = require("https");
const geohash = require("ngeohash");

const app = express();

// TODO: delete when deploy
// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// @route GET /api/autocomplete?keyword=
// @desc  Get autocomplete data from Ticketmaster
app.get("/api/autocomplete", (req, res) => {
  https.get(
    "https://app.ticketmaster.com/discovery/v2/suggest?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB&keyword=" +
      req.query.keyword,
    resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        res.send(JSON.parse(data));
      });
    }
  );
});

// @route GET /api/search
// @desc  Search events from Ticketmaster
app.get("/api/search", (req, res) => {
  var url =
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB&keyword=" +
    req.query.keyword +
    "&segmentId=";

  switch (req.query.catagory) {
    case "all":
      break;
    case "music":
      url += "KZFzniwnSyZfZ7v7nJ";
      break;
    case "sports":
      url += "KZFzniwnSyZfZ7v7nE";
      break;
    case "arts":
      url += "KZFzniwnSyZfZ7v7na";
      break;
    case "film":
      url += "KZFzniwnSyZfZ7v7nn";
      break;
    case "miscellaneous":
      url += "KZFzniwnSyZfZ7v7n1";
      break;
  }

  url += "&radius=" + req.query.distance;

  url += "&unit=" + req.query.unit;

  url += "&geoPoint=" + geohash.encode(req.query.lat, req.query.lng);

  url += "&sort=date,asc";

  https.get(url, resp => {
    let data = "";

    resp.on("data", chunk => {
      data += chunk;
    });

    resp.on("end", () => {
      res.send(JSON.parse(data));
    });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
