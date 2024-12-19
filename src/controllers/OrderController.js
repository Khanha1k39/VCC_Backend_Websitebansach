const OrderService = require("../services/OrderService");
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, orderItems } = req.body;
    console.log("shippingAddress", shippingAddress);
    const { email, address, phone } = shippingAddress;
    if (!email || !address || !phone) {
      return res.status(400).json({
        message:
          "Thông tin địa chỉ giao hàng không đầy đủ (email, address, phone).",
      });
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Địa chỉ email không hợp lệ." });
    }
    const phoneRegex =
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
    }
    if (!Array.isArray(orderItems)) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm (items) không hợp lệ." });
    }
    if (orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm (items) trống" });
    }

    const data = await OrderService.createOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};
const checkQuantityStock = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!Array.isArray(orderItems)) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm (items) không hợp lệ." });
    }
    if (orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm (items) trống" });
    }

    const data = await OrderService.checkQuantityStock(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: error?.message });
  }
};

module.exports = { createOrder, checkQuantityStock };
