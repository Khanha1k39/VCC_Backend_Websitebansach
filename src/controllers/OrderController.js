const OrderService = require("../services/OrderService");
const createOrder = async (req, res) => {
  try {
    const { title, image, type, price, countInStock, rating, description } =
      req.body;
    const data = await OrderService.createProduct(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
};

module.exports = { createOrder };
