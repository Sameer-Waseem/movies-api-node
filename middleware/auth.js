const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided");

    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decodedPayload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
