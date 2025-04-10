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
const { corsOptions } = require("./config/cors");
const { errorHandlingMiddleware } = require("./middlewares/errorHandling");

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
const redisClient = require("./dbs/redis");
redisClient.connect().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`lisening on ${port}`);
});

const sendOrderToKafka = async (orderDetails) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "order-topic",
      messages: [{ value: JSON.stringify(orderDetails) }],
    });
    console.log("Order sent to Kafka");
  } catch (err) {
    console.error("Error sending order to Kafka:", err);
  }
};

// API nhận đơn hàng và gửi tới Kafka
app.post("/order", async (req, res) => {
  const orderDetails = req.body;
  await sendOrderToKafka(orderDetails);
  res.send("Order placed, email will be sent shortly");
});

routes(app);
// app.use(errorHandlingMiddleware);
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

// app.use((error, req, res, next) => {
//   console.log(error);
//   const statusCode = error.status || 500;

//   return res.status(statusCode).json({
//     status: "error",
//     code: statusCode,
//     message: error.message || "Internal Server Error",
//   });
// });
