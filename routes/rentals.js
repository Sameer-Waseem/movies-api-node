const Fawn = require("fawn");
const express = require("express");

const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.status(200).send(rentals);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { customerId, movieId } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).send("Customer with the given id was not found.");

    const movie = await Movie.findById(movieId);
    if (!movie)
      return res.status(404).send("Movie with the given id was not found.");

    if (movie.numberInStock === 0)
      return res.status(404).send("Movie not found");

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.status(200).send(rental);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
