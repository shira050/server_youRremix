const mongoose = require("mongoose");
const Joi = require("joi");

const matchSchema = new mongoose.Schema({
  id_user: String,
  id_song: String,
});

exports.MatchModel = mongoose.model("matches", matchSchema);

exports.validMatch = (_bodyData) => {
  let joiSchema = Joi.object({
    id_user: Joi.string().min(2).max(99).required(),
    id_song: Joi.string().min(2).max(99).required(),
  });
  return joiSchema.validate(_bodyData);
};
