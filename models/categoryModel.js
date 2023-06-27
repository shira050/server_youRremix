const mongoose = require("mongoose");
const Joi = require("joi");


const categorySchema = new mongoose.Schema({
  title: String,
  cover: String,
  backgroundColor:String,
  active: {
    type: Boolean,
    default: true,
  },
});

exports.CategoryModel = mongoose.model("categories", categorySchema);

exports.validCategory = (_bodyData) => {
  let joiSchema = Joi.object({
    title: Joi.string().min(2).max(99).required(),
    cover: Joi.string().min(2).max(300).required(),
    backgroundColor: Joi.string().min(2).max(100).required(),
  });
  return joiSchema.validate(_bodyData);
};

