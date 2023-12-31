const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { routesInit} = require("./routes/config_routes");
require("./db/mongoConnect");
const fileUpload = require("express-fileupload");


const app = express();

app.use(cors());
app.use(fileUpload({limits:{fileSize: 1024 * 1024 * 5 }}))


app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

routesInit(app);

const server = http.createServer(app);

console.log("env", process.env.TEST, process.env.USER_DB);
let port = process.env.PORT || 3000;
server.listen(port);