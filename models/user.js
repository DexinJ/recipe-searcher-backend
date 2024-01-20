const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  recipes: {
    type: [
      {
        type: Number,
      },
    ],
  },
});

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((thisUser) => {
      if (!thisUser) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, thisUser.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return thisUser;
      });
    });
};

module.exports = mongoose.model("user", user);
