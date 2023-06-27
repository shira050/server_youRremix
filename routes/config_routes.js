const indexR = require("./index");
const usersR = require("./users");
const songsR = require("./songs");
const categoriesR = require("./categories");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/songs", songsR);
  app.use("/categories", categoriesR);
};
