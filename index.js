const Joi = require("joi");
const Fawn = require("fawn");
const cors = require("cors");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");

Joi.objectId = require("joi-objectid")(Joi);

const users = require("./routes/users");
const login = require("./routes/login");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const error = require("./middleware/error");
const customers = require("./routes/customers");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use("/api/login", login);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/register", users);
app.use("/api/rentals", rentals);
app.use("/api/customers", customers);

app.use(error);

Fawn.init("mongodb://localhost/vidly");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Could not connected to MongoDB...", error));

// to check the current environment, if it's not set developement will be showed by default
// to set environment use NODE_ENV=production in terminal
// console.log(`app: ${app.get("env")}`);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
