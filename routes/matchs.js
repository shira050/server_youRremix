const express = require("express");
const router = express.Router();
const { MatchModel, validMatch } = require("../models/matchModel");
const { auth } = require("../auth/authToken");

router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await MatchModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.post("/", async (req, res) => {
  let validBody = validMatch(req.body);
  console.log(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let match = new CakeModel(req.body);
    match.id_user = req.dataToken._id;
    await cake.save();
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.delete("/:idDel", async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await MatchModel.deleteOne({
      _id: idDel,
      user_id: req.dataToken._id,
    });

    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validMatch(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await MatchModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
module.exports = router;
