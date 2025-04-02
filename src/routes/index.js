const userRoute = require("./Useroute.js");
const productRoute = require("./ProductRoute.js");
const OrderRoute = require("./OrderRoute.js");

const routes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/order", OrderRoute);
};
module.exports = routes;
