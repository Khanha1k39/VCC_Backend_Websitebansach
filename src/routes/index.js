const userRoute = require("./Useroute.js");
const productRoute = require("./ProductRoute.js");
const OrderRoute = require("./OrderRoute.js");

const routes = (app) => {
  console.log("hihi");
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/order", OrderRoute);
};
module.exports = routes;
