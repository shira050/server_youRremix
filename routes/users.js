const express = require("express");
var LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./scratch");
const router = express.Router();
const {
  UserModel,
  validUser,
  loginValid,
  getToken,
  validUserWithoutPass,
} = require("../models/userModel");
const { auth, authAdmin } = require("../auth/authToken");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

router.get("/", authAdmin, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    // console.log(UserModel.find({}).json);
    debugger;
    let data = await UserModel.find({active: true})

      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/usersList", authAdmin, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";

  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data = await UserModel.find({ active: true })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/userInfo", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    ).populate({ path: "lastSearch", model: "songs" });
    res.json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/myEmail", auth, async (req, res) => {
  let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 });

  res.json(user);
});

router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  console.log(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    console.log("check");
    user.password = await bcrypt.hash(user.password, 10);
    
    await user.save();
    user.password = "*****";

    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ msg: "Email already in system try again", code: 11000 });
    }
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

// router.post("/login", async (req, res) => {
//   let valdiateBody = loginValid(req.body);
//   if (valdiateBody.error) {
//     return res.status(400).json(valdiateBody.error.details);
//   }
//   try {
//     let user = await UserModel.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(401).json({ msg: "User and password not match 1" });
//     }

//     let validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) {
//       return res.status(401).json({ msg: "User and password not match 2" });
//     }

//     let newToken = getToken(user._id, user.role);
//     localStorage.setItem("token", newToken);
//     console.log(newToken);
//     res.json({ your_token: newToken });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "err", err });
//   }
// });


router.post("/login", async (req, res) => {
  debugger
  let validateBody = loginValid(req.body);
  if (validateBody.error) {
    return res.status(400).json(validateBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "User and password not match" });
    }

    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "User and password not match" });
    }

    let accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    let refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET);

    // Save the refresh token in the user document or any other secure storage
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ your_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});
  
  function generateAccessToken(userId, userRole) {
    return jwt.sign({ userId, userRole }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m', // Set the expiration time for the access token
    });
  }
  
  function generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET);
  }

router.patch("/:idDel", authAdmin, async (req, res) => {
  if (req.body.active == null || req.body.active == undefined) {
    return res.status(400).json({ msg: "Need to send active in body" });
  }
  try {
    console.log("000000000000000000000");
    let idDele = req.params.idDel;
    console.log(idDele);
    let userUpdate = await UserModel.updateOne(
      { _id: idDele },
      { $set: { active: req.body.active } }
    );
    console.log(userUpdate);
    res.json(userUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/:idEdit", auth, async (req, res) => {
  debugger
  let validBody = validUserWithoutPass(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    console.log("gggggg");
    debugger
    let idEdit = req.params.idEdit;
    let data = await UserModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

module.exports = router;
