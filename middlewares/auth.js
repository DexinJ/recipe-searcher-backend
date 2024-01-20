const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthorizationError = require("../Errors/AuthorizationError");

const handleAuthError = (next) => {
  next(new AuthorizationError("Authorization Error"));
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};
