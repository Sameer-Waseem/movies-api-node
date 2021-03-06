const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");

const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    next(error);
  }
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

module.exports = router;
