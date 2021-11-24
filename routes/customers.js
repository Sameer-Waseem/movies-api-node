const express = require("express");

const auth = require("../middleware/auth");
const { validateId } = require("../utils/functions");
const { Customer, validate } = require("../models/customer");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Customer not found.");
    res.status(200).send(customer);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, isGold, phone } = req.body;

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const customer = new Customer({
      name,
      isGold,
      phone,
    });

    await customer.save();

    res.status(200).send(customer);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isGold, phone } = req.body;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const validation = validate(req.body);
    if (validation.error)
      return res.status(400).send(validation.error.details[0].message);

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Genre not found.");

    customer.set({ name, isGold, phone });

    await customer.save();
    res.status(200).send(customer);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) return res.status(400).send("Invalid ID.");

    const customer = await Customer.findByIdAndRemove(id);
    if (!customer) return res.status(404).send("Genre not found.");

    res.status(200).send(customer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
