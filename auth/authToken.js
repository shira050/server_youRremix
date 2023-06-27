const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    res.status(401).json({ msg: "you must send token" });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    // res.status(401).json({ msg: "Token invalid or expired, code:3" });
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "token invalid" });
  }
};

exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    res.status(401).json({ msg: "you must send token" });
  }
  try {
    let decodeToken = jwt.verify(token, config.tokenSecret);
    if (decodeToken.role != "admin" && decodeToken._id != "64917ae8bc21c8ded5e11b63") {
      res.status(401).json({ msg: "Token invalid or expired, code:3" });
    }
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "token invalid" });
  }
};
