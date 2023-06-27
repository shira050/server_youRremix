const mongoose = require("mongoose");
const { config } = require("../config/secret");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${config.userDb}:${config.passDb}@cluster0.z63o1bv.mongodb.net/project`
  );
  console.log("mongo connect b23");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
