const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { sendEmailCreateOrder } = require("./EmailService");
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
      console.log(result);

      res("ok");
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
