const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { sendEmailCreateOrder } = require("./EmailService");
const Order = require("../models/OrderModel");
const createOrder = async (newOrder) => {
  return new Promise(async (res, rej) => {
    try {
      const { orderItems } = newOrder;
      const checkStockPromises = orderItems.map((item) =>
        Book.findById(item.product).then((product) => {
          if (!product) {
            throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho.`);
          }
          if (product.quantity_available < item.amount) {
            throw new Error(
              `Sản phẩm ${item.name} chỉ còn ${product.quantity_available} sản phẩm, không đủ số lượng yêu cầu.`
            );
          }
        })
      );
      const result = await Promise.all(checkStockPromises);
      const updates = orderItems.map((item) =>
        Book.findOneAndUpdate(
          { _id: item.product },
          { $inc: { quantity_available: -item.amount } },
          { new: true }
        ).then((updatedProduct) => {
          if (!updatedProduct) {
            throw new Error(
              `Sản phẩm ${item.name} không tồn tại hoặc không đủ số lượng trong kho.`
            );
          }
          return updatedProduct;
        })
      );

      await Promise.all(updates);
      const createOrder = await Order.create(newOrder);
      await sendEmailCreateOrder(createOrder);
      res(createOrder);
    } catch (error) {
      rej(error);
    }
  });
};

const checkQuantityStock = async (newOrder) => {
  return new Promise(async (res, rej) => {
    try {
      const { orderItems } = newOrder;
      const checkStockPromises = orderItems.map((item) =>
        Book.findById(item.product).then((product) => {
          if (!product) {
            throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho.`);
          }
          if (product.quantity_available < item.amount) {
            throw new Error(
              `Sản phẩm ${item.name} chỉ còn ${product.quantity_available} sản phẩm, không đủ số lượng yêu cầu.`
            );
          }
        })
      );
      await Promise.all(checkStockPromises);
      res({ status: "OK", message: "Success" });
    } catch (error) {
      console.log("errpr rec", error);
      rej(error);
    }
  });
};

module.exports = {
  createOrder,
  checkQuantityStock,
};
