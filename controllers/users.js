const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../Errors/BadRequestError");
const NotFoundError = require("../Errors/NotFoundError");
const AuthorizationError = require("../Errors/AuthorizationError");
const ConflictError = require("../Errors/ConfilctError");

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError("Email already used!"));
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => Users.create({ name, email, password: hash }))
          .then((newUser) => {
            res.send({
              name: newUser.name,
              email: newUser.email,
            });
          })
          .catch((e) => {
            if (e.name === "ValidationError") {
              next(new BadRequestError("Validation Failed!"));
            } else {
              next(e);
            }
          });
      }
    })
    .catch((e) => {
      next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AuthorizationError("Incorrect email or password"));
  } else {
    Users.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res
          .cookie("jwt", token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .send({ name: user.name });
      })
      .catch((e) => {
        if (e.message === "Incorrect email or password") {
          next(new AuthorizationError("Incorrect email or password"));
        } else {
          next(e);
        }
      });
  }
};

const logout = (req, res) => {
  res
    .cookie("jwt", "", {
      maxAge: 5000,
      httpOnly: true,
      sameSite: true,
    })
    .end();
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find user"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

const addToCollection = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  Users.findByIdAndUpdate(
    userId,
    { $addToSet: { recipes: itemId } },
    { new: true }
  )
    .orFail()
    .then((user) => res.send(user.recipes))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find user"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

const removeFromCollection = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  Users.findByIdAndUpdate(userId, { $pull: { recipes: itemId } }, { new: true })
    .orFail()
    .then((user) => res.send(user.recipes))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find user"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

const getCollection = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user.recipes))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Cannot find user"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid Id."));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getCurrentUser,
  addToCollection,
  removeFromCollection,
  getCollection,
};
