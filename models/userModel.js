const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  role: {
    type: String,
    default: "USER",
  },
  active: {
    type: Boolean,
    default: true,
  },
  // lastSearch: [mongoose.ObjectId],
  lastSearch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs' }],

});

exports.UserModel = mongoose.model("users", userSchema);

exports.validUser = (_bodyData) => {
  let joiSchema = Joi.object({
    firstName: Joi.string().min(2).max(99).required(),
    lastName: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(6).max(50).required(),
    avatar: Joi.string().min(6).max(500).required(),
  });
  return joiSchema.validate(_bodyData);
};
exports.validUserWithoutPass = (_bodyData) => {
  let joiSchema = Joi.object({
    firstName: Joi.string().min(2).max(99).required(),
    lastName: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    avatar: Joi.string().min(6).max(500).required(),
  });
  return joiSchema.validate(_bodyData);
};
exports.loginValid = (_bodyData) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(6).max(50).required(),
  });
  return joiSchema.validate(_bodyData);
};

exports.getToken = (_userId, role) => {
  let token = jwt.sign({ _id: _userId, role }, config.tokenSecret, {
    expiresIn: "60mins",
  });
  return token;
};
