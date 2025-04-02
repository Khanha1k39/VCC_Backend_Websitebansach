const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ path: __dirname + "/.env" });
const bodyParse = require("body-parser");
const routes = require("./routes/index");
const port = process.env.POR || 3001;
const cors = require("cors");
const userName = process.env.DB_USER_NAME;
const password = process.env.DB_PW;
const uri = `mongodb+srv://${userName}:${password}@cluster0.jmoxqb2.mongodb.net/vcc?retryWrites=true&w=majority&appName=Cluster0`;
const cookieParser = require("cookie-parser");
app.use(cors(corsOptions));
app.options("*", cors());

app.use(bodyParse.json());
app.use(cookieParser());

mongoose
  .connect(uri)
  .then(() => {
    console.log("success");
  })
  .catch(() => {
    console.log("faile to conect db");
  });
const { initRedis } = require("./dbs/redis");
const { corsOptions } = require("./config/cors");
initRedis();

app.listen(port, () => {
  console.log(`lisening on ${port}`);
});

routes(app);
