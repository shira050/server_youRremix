const express = require("express");
const router = express.Router();
const { CategoryModel, validCategory } = require("../models/categoryModel");
const { auth, authAdmin } = require("../auth/authToken");

router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await CategoryModel.find({active:true})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.post("/", authAdmin, async (req, res) => {
  let validBody = validCategory(req.body);
  console.log(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let category = new CategoryModel(req.body);
    category.title = category.title.toUpperCase();
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.patch("/:idDel", authAdmin, async (req, res) => {
  if (req.body.active == null || req.body.active == undefined) {
    return res.status(400).json({ msg: "Need to send active in body" });
  }
  try {
    let idDele = req.params.idDel;
    let categoryUpdate = await CategoryModel.updateOne(
      { _id: idDele },
      { $set: { active: req.body.active } }
    );
    console.log(categoryUpdate);
    res.json(categoryUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/:idEdit", authAdmin, async (req, res) => {
  let validBody = validCategory(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await CategoryModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
module.exports = router;
