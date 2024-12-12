const userRoute = require("./Useroute.js");
const productRoute = require("./ProductRoute.js");

const routes = (app) => {
  console.log("hihi");
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
};
module.exports = routes;
