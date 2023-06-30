require("dotenv").config();

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_SECRET,
    refreshTokenSecret:process.env.REFRESH_TOKEN_SECRET,
    accessTokenSecret:process.env.ACCESS_TOKEN_SECRET

}