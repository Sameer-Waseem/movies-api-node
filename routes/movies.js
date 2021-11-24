const express = require("express");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const { validateId } = require("../utils/functions");
const { Movie, validate } = require("../models/movie");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).send("Movie not found.");
    res.status(200).send(movie);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, genreId, numberInStock, dailyRentalRate } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const genre = await Genre.findById(genreId);
    if (!genre)
      return res.status(404).send(`Genre with the given id doesn't exists`);

    const movie = new Movie({
      title,
      genre: { _id: genreId, name: genre.name },
      numberInStock,
      dailyRentalRate,
    });

    await movie.save();
    res.status(200).send(movie);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genreId, numberInStock, dailyRentalRate } = req.body;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).send("Movie not found.");

    movie.set({ title, genreId, numberInStock, dailyRentalRate });

    await movie.save();
    res.status(200).send(movie);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const movie = await Movie.findByIdAndRemove(id);
    if (!movie) return res.status(404).send("Movie not found.");

    res.status(200).send(movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
