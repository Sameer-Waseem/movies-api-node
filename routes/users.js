const bcrypt = require("bcrypt");
const express = require("express");
const passwordComplexity = require("joi-password-complexity");

const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const { error } = passwordComplexity().validate(password);
    if (error)
      return res
        .status(400)
        .send(error.details[0].message.replace("value", "password"));

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists.");

    user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header('access-control-expose-headers','x-auth-token')
      .status(200)
      .send({ _id: user._id, name, email });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
