var express = require("express");
var router = express.Router();
const request = require("superagent");

const apiKey = "7c53bd46706298a65e4a124494847e2b";
const baseUrl = `https://api.themoviedb.org/3`;
const nowPlaying = `${baseUrl}/movie/now_playing?api_key=${apiKey}`;
const image = `https://image.tmdb.org/t/p/w300`;

router.use((req, res, next) => {
  // locals is available on every response object sent for every request
  res.locals.imageUrl = image;
  next();
});

/* GET home page. */
router.get("/", (req, res, next) => {
  request
    .get(nowPlaying)
    .then((data) => {
      // console.log(data.body.results);
      const movieData = JSON.parse(data.text);
      // either movieData or movies will give us what we want
      const movies = data.body;
      // res.json(movies);
      res.render("index", {
        movies: movies.results,
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.get("/movie/:id", async (req, res, next) => {
  // we are fetching from the id, and this is stored on req.params
  const movie_id = req.params.id;
  try {
    const movie = await request.get(
      `${baseUrl}/movie/${movie_id}?api_key=${apiKey}`
    );
    // console.log(result.body);
    const movieData = movie.body;
    // res.json(movieData);
    res.render("singlemuvee", {
      data: movieData,
    });
  } catch (e) {
    console.log("Error ", e);
  }
});

router.post("/search", async (req, res, next) => {
  // since we are sending data over the wire, express.urlencoded() makes it possible for us to read the data in forms
  const searchTerm = encodeURI(req.body.movieSearch);
  const category = req.body.cat;
  const searchUrl = `${baseUrl}/search/${category}?query=${searchTerm}&api_key=${apiKey}`;
  try {
    const result = await request.get(searchUrl);
    // we can also do below;
    // const movieData = JSON.parse(result.text)
    const data = result.body;
    // console.log(req.query);
    // res.json(data);
    if (category === "person") {
      data.results = data.results[0].known_for;
    }
    res.render("index", {
      movies: data.results,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
