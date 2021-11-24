const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true,
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, min: 0, max: 255, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 255, required: true },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(genre) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });

  return schema.validate(genre);
}

exports.Movie = Movie;
exports.validate = validateMovie;
