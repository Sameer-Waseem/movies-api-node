const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { validateId } = require("../utils/functions");
const { Genre, validate } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.status(200).send(genres);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send("Genre not found.");

    res.status(200).send(genre);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const genre = new Genre({
      name,
    });

    await genre.save();

    res.status(200).send(genre);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send("Genre not found.");

    genre.set({ name });

    await genre.save();
    res.status(200).send(genre);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const genre = await Genre.findByIdAndRemove(id);
    if (!genre) return res.status(404).send("Genre not found.");

    res.status(200).send(genre);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
