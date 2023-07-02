const express = require("express");
const router = express.Router();
const { SongModel, validSong } = require("../models/songModel");
const { auth, authAdmin } = require("../auth/authToken");
const { UserModel } = require("../models/userModel");

router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await SongModel.find({ active: true })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});


router.get("/mostSearch", async (req, res) => {
  try {debugger
    let data = await SongModel.find({ active: true })
      .sort({ countSearch: -1 }) // Sort in descending order based on countSearch
      .limit(20); // Limit the results to 20 songs
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});


router.post("/", auth, async (req, res) => {
  let validBody = validSong(req.body);
  console.log(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  debugger;
  try {
    let song = new SongModel(req.body);
    console.log(req.tokenData._id);
    song.user_id = req.tokenData._id;
    await song.save();
    res.status(201).json(song);
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
    console.log(idDele);
    let songUpdate = await SongModel.updateOne(
      { _id: idDele },
      { $set: { active: req.body.active } }
    );
    console.log(songUpdate);
    res.json(songUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/:idEdit", authAdmin, async (req, res) => {
  let validBody = validSong(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await SongModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/myPlaylist", auth, async (req, res) => {
  try {
    let myPlaylist = await UserModel.findOne({
      _id: req.tokenData._id,
    }).populate({ path: "lastSearch", model: "songs" });
    res.json(myPlaylist);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/search", auth, async (req, res) => {
  debugger
  try {
    let searchQ = req.query.s.toLowerCase();
    const songs = await SongModel.find({}).exec();
    let temp_song = songs.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchQ) ||
        item.src.toLowerCase().includes(searchQ)
      );
    });
debugger
    if (temp_song.length > 0) {
      await Promise.all(
        temp_song.map((song) =>
          SongModel.updateOne(
            { _id: song._id },
            { $inc: { countSearch: 1 } }
          )
        )
      );

      if (temp_song.length === 1) {
        await UserModel.updateOne(
          { _id: req.tokenData._id },
          { $addToSet: { lastSearch: temp_song[0]._id } }
        );
      }
    } else {
      return res.status(404).json({ error: "Song not found" });
        //TODO: אם לא קיים השיר נזמן יצירת שיר

    }

    res.json(temp_song);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:idCategory", async (req, res) => {
  debugger;
  let idCategory = req.params.idCategory;

  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await SongModel.find({ active: true, category_id: idCategory })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

module.exports = router;
