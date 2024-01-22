const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthorizationError = require("../Errors/AuthorizationError");

const handleAuthError = (next) => {
  next(new AuthorizationError("Authorization Error"));
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return handleAuthError(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};
