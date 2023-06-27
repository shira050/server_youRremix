const mongoose = require("mongoose");
const Joi = require("joi");

const songSchema = new mongoose.Schema({
  title: String,
  subtitle:String,
  src: String,//השיר הסופי קובץ mp3
  category_id: String,
  image:String,
  rate: { type: Number, default: 5 },
  countSearch: { type: Number, default: 0 },
  active: {
    type: Boolean,
    default: true,
  },
  user_id: String,
});

exports.SongModel = mongoose.model("songs", songSchema);

exports.validSong = (_bodyData) => {
  let joiSchema = Joi.object({
    title: Joi.string().min(2).max(99).required(),
    subtitle: Joi.string().min(2).max(200).required(),
    image: Joi.string().min(2).max(200).required(),
    src: Joi.string().min(2).max(300).required(),
    category_id: Joi.string().min(2).max(99).required(),
    rate: Joi.number().min(1).max(5),
  });
  return joiSchema.validate(_bodyData);
};
