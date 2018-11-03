const express = require("express");
const https = require("https");

const app = express();

// @route GET /api/autocomplete?keyword=
// @desc  Get autocomplete data from Ticketmaster
app.get("/api/autocomplete", (req, res) => {
  https.get(
    "https://app.ticketmaster.com/discovery/v2/suggest?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB&keyword=" +
      req.query.keyword,
    resp => {
      let data = "";

      // A chunk of data has been recieved.
      resp.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        res.send(JSON.parse(data));
      });
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
