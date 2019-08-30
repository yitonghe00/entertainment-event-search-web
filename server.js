const path = require("path");
const express = require("express");
const https = require("https");
const geohash = require("ngeohash");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// **********
//   SET UP
// **********

app.use("/", express.static(path.join(__dirname, "dist")));

// Allow the frontend to access the backend during development
if (process.env.NODE_ENV === "development") {
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
}

// Spotify API
var spotifyApi = new SpotifyWebApi({
  clientId: "d47fce99bb7c4428b1c001894543eeff",
  clientSecret: "f4aac16e9a3e4a9db459b24a7e3deddd"
});

// **********
//   ROUTE
// **********

app.get("/test/error", (req, res) => {
  return res.status(500).send();
});

app.get("/test/env", (req, res) => {
  res.send(process.env.NODE_ENV);
});

// @route GET /api/autocomplete?keyword=
// @desc  Get autocomplete data from Ticketmaster
app.get("/api/autocomplete", (req, res) => {
  https
    .get(
      "https://app.ticketmaster.com/discovery/v2/suggest?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB&keyword=" +
        req.query.keyword,
      resp => {
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        resp.on("end", () => {
          return res.send(JSON.parse(data));
        });
      }
    )
    .on("error", e => {
      return res.status(500).send(e);
    });
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

  if (req.query.lat && req.query.lng) {
    url += "&geoPoint=" + geohash.encode(req.query.lat, req.query.lng);
    url += "&sort=date,asc";
    https
      .get(url, resp => {
        let rdata = "";

        resp.on("data", chunk => {
          rdata += chunk;
        });

        resp.on("end", () => {
          return res.send(JSON.parse(rdata));
        });
      })
      .on("error", e => {
        return res.status(500).send(e);
      });
  } else {
    https
      .get(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          req.query.location +
          "&key=AIzaSyDb7GELau72-aTrK6OF6auplZxv5xQzFoA",
        resp => {
          let data = "";

          resp.on("data", chunk => {
            data += chunk;
          });

          resp.on("end", () => {
            var dataJSON = JSON.parse(data)["results"][0];
            if (dataJSON) {
              url +=
                "&geoPoint=" +
                geohash.encode(
                  dataJSON["geometry"]["location"].lat,
                  dataJSON["geometry"]["location"].lng
                );

              url += "&sort=date,asc";

              https
                .get(url, resp => {
                  let rdata = "";

                  resp.on("data", chunk => {
                    rdata += chunk;
                  });

                  resp.on("end", () => {
                    return res.send(JSON.parse(rdata));
                  });
                })
                .on("error", e => {
                  return res.status(500).send(e);
                });
            } else {
              return res.send({});
            }
          });
        }
      )
      .on("error", e => {
        return res.status(500).send(e);
      });
  }
});

// @route GET /api/detail
// @desc  Search event detail by id
app.get("/api/detail", (req, res) => {
  https
    .get(
      "https://app.ticketmaster.com/discovery/v2/events/" +
        req.query.id +
        "?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB",
      resp => {
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        resp.on("end", () => {
          return res.send(JSON.parse(data));
        });
      }
    )
    .on("error", e => {
      return res.status(500).send(e);
    });
});

// @route GET /api/music
// @desc  Search the artist on the Spotify
app.get("/api/music", (req, res) => {
  var returnJSON = {
    index: Number(req.query.index),
    name: "",
    followers: "",
    popularity: "",
    url: ""
  };
  spotifyApi.searchArtists(req.query.keyword).then(
    function(data) {
      var dataJSON = data.body.artists.items;
      for (var i = 0; i < dataJSON.length; i++) {
        if (
          dataJSON[i].name.toLowerCase() === req.query.keyword.toLowerCase()
        ) {
          returnJSON.name = dataJSON[i].name;
          if (dataJSON[i].followers && dataJSON[i].followers) {
            returnJSON.followers = dataJSON[i].followers.total.toLocaleString();
          }
          if (dataJSON[i].popularity) {
            returnJSON.popularity = dataJSON[i].popularity;
          }
          if (dataJSON[i].external_urls && dataJSON[i].external_urls.spotify) {
            returnJSON.url = dataJSON[i].external_urls.spotify;
          }
          break;
        }
      }
      return res.send(returnJSON);
    },
    function(err) {
      if (err.statusCode == "401") {
        // No token or expired
        // Retrieve an access token.
        spotifyApi.clientCredentialsGrant().then(
          function(data) {
            console.log(
              "The access token expires in " + data.body["expires_in"]
            );
            console.log("The access token is " + data.body["access_token"]);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body["access_token"]);

            // Search Again
            spotifyApi
              .searchArtists(req.query.keyword)
              .then(function(data) {
                var dataJSON = data.body.artists.items;
                for (var i = 0; i < dataJSON.length; i++) {
                  if (
                    dataJSON[i].name.toLowerCase() ===
                    req.query.keyword.toLowerCase()
                  ) {
                    returnJSON.name = dataJSON[i].name;
                    if (dataJSON[i].followers && dataJSON[i].followers) {
                      returnJSON.followers = dataJSON[
                        i
                      ].followers.total.toLocaleString();
                    }
                    if (dataJSON[i].popularity) {
                      returnJSON.popularity = dataJSON[i].popularity;
                    }
                    if (
                      dataJSON[i].external_urls &&
                      dataJSON[i].external_urls.spotify
                    ) {
                      returnJSON.url = dataJSON[i].external_urls.spotify;
                    }
                    break;
                  }
                }
                return res.send(returnJSON);
              })
              .catch(err => {
                console.log(err);
              });
          },
          function(err) {
            console.log(
              "Something went wrong when retrieving an access token",
              err
            );
          }
        );
      } else {
        return res.status(500).send(err);
      }
    }
  );
});

// @route GET /api/image
// @desc  Search for images with Google Custom Engine
app.get("/api/image", (req, res) => {
  https
    .get(
      "https://www.googleapis.com/customsearch/v1?q=" +
        req.query.keyword +
        "&cx=010461299748917647877:vlrnji1qnls&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyDSJ_mHpHSGCWiRNJnQGpd9gV1izoFCPek",
      resp => {
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        var returnJSON = {
          name: req.query.keyword,
          links: []
        };
        resp.on("end", () => {
          var dataJSON = JSON.parse(data).items;
          if (dataJSON) {
            dataJSON.forEach(item => {
              returnJSON.links.push(item.link.slice(0));
            });
          }
          return res.send(returnJSON);
        });
      }
    )
    .on("error", e => {
      return res.status(500).send(e);
    });
});

// @route GET /api/venue
// @desc  Search for the venue on Ticketmaster and Google Map
app.get("/api/venue", (req, res) => {
  setTimeout(() => {
    https
      .get(
        "https://app.ticketmaster.com/discovery/v2/venues?apikey=JpHrwvk3aAh8HnBJJwIBoMa22LlswFXB&keyword=" +
          req.query.keyword,
        resp => {
          let data = "";

          resp.on("data", chunk => {
            data += chunk;
          });

          resp.on("end", () => {
            var dataJSON = JSON.parse(data);
            if (!dataJSON._embedded) {
              console.log("ERROR");
              console.log(dataJSON);
              return res.send({});
            }
            dataJSON = dataJSON._embedded.venues[0];
            var returnJSON = {
              name: "",
              address: "",
              city: "",
              phoneNumber: "",
              openHours: "",
              generalRule: "",
              childRule: "",
              lat: "",
              lng: ""
            };
            returnJSON.name += dataJSON.name;
            if (dataJSON.address && dataJSON.address.line1) {
              returnJSON.address += dataJSON.address.line1;
            }
            if (dataJSON.city) {
              returnJSON.city += dataJSON.city.name;
              if (dataJSON.state) {
                returnJSON.city += ", " + dataJSON.state.name;
              }
            }
            if (
              dataJSON.boxOfficeInfo &&
              dataJSON.boxOfficeInfo.phoneNumberDetail
            ) {
              returnJSON.phoneNumber +=
                dataJSON.boxOfficeInfo.phoneNumberDetail;
            }
            if (
              dataJSON.boxOfficeInfo &&
              dataJSON.boxOfficeInfo.openHoursDetail
            ) {
              returnJSON.openHours = dataJSON.boxOfficeInfo.openHoursDetail;
            }
            if (dataJSON.generalInfo && dataJSON.generalInfo.generalRule) {
              returnJSON.generalRule = dataJSON.generalInfo.generalRule;
            }
            if (dataJSON.generalInfo && dataJSON.generalInfo.childRule) {
              returnJSON.childRule = dataJSON.generalInfo.childRule;
            }
            https
              .get(
                "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                  req.query.keyword +
                  "&key=AIzaSyDb7GELau72-aTrK6OF6auplZxv5xQzFoA",
                resp => {
                  let positionData = "";

                  resp.on("data", chunk => {
                    positionData += chunk;
                  });

                  resp.on("end", () => {
                    positionJSON = JSON.parse(positionData);
                    if (
                      positionJSON.results[0] &&
                      positionJSON.results[0]["geometry"] &&
                      positionJSON.results[0]["geometry"]["location"]
                    ) {
                      returnJSON.lat =
                        positionJSON.results[0]["geometry"]["location"]["lat"];
                      returnJSON.lng =
                        positionJSON.results[0]["geometry"]["location"]["lng"];
                    }
                    return res.send(returnJSON);
                  });
                }
              )
              .on("error", e => {
                return res.status(500).send(e);
              });
          });
        }
      )
      .on("error", e => {
        return res.status(500).send(e);
      });
  }, 1000);
});

// @route GET /api/upcoming
// @desc  Search venue's upcoming events on Songkick
app.get("/api/upcoming", (req, res) => {
  https
    .get(
      "https://api.songkick.com/api/3.0/search/venues.json?query=" +
        req.query.keyword +
        "&apikey=wwGJLQvvHvQ1mZjC",
      resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          var dataJSON = JSON.parse(data);
          if (dataJSON.resultsPage.totalEntries == 0) {
            // Venue not found
            return res.send([]);
          } else {
            https
              .get(
                "https://api.songkick.com/api/3.0/venues/" +
                  dataJSON.resultsPage.results.venue[0].id +
                  "/calendar.json?apikey=wwGJLQvvHvQ1mZjC",
                resp => {
                  let eventsData = "";
                  resp.on("data", chunk => {
                    eventsData += chunk;
                  });
                  resp.on("end", () => {
                    var eventsJSON = JSON.parse(eventsData);
                    if (eventsJSON.resultsPage.totalEntries == 0) {
                      // Venue doesn't have upcoming event
                      return res.send([]);
                    } else {
                      var returnJSON = [];
                      eventsJSON.resultsPage.results.event.forEach(event => {
                        var eventJSON = {
                          name: "N/A",
                          uri: "",
                          artist: "N/A",
                          time: "N/A",
                          date: "N/A",
                          type: "N/A"
                        };
                        if (event.displayName) {
                          eventJSON.name = event.displayName;
                        }
                        if (event.uri) {
                          eventJSON.uri = event.uri;
                        }
                        if (
                          event.performance &&
                          event.performance[0] &&
                          event.performance[0].displayName
                        ) {
                          eventJSON.artist = event.performance[0].displayName;
                        }
                        if (event.start && event.start.date) {
                          eventJSON.date = event.start.date;
                        }
                        if (event.start && event.start.time) {
                          eventJSON.time = event.start.time;
                        }
                        if (event.type) {
                          eventJSON.type = event.type;
                        }
                        returnJSON.push(eventJSON);
                      });
                    }
                    return res.send(returnJSON);
                  });
                }
              )
              .on("error", e => {
                return res.status(500).send(e);
              });
          }
        });
      }
    )
    .on("error", e => {
      return res.status(500).send(e);
    });
});

// Send the index.html inside dist/ when user trying to access the webpage
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Use process port for production and 3000 for development
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
