const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { sendEmailCreateOrder } = require("./EmailService");
const Order = require("../models/OrderModel");
const { acquireLock, releaseLock } = require("./redis.service");
const { BadRequestError } = require("../core/error.response");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"], // địa chỉ Kafka broker
});
const producer = kafka.producer();

// const createOrder = async (newOrder) => {
//   return new Promise(async (res, rej) => {
//     try {
//       const { orderItems } = newOrder;
//       const accquireProduct = [];
//       const checkStockPromises = orderItems.map((item) =>
//         Book.findById(item.product).then((product) => {
//           if (!product) {
//             throw new Error(`Sản phẩm ${item.name} không tồn tại trong kho.`);
//           }
//           if (product.quantity_available < item.amount) {
//             throw new Error(
//               `Sản phẩm ${item.name} chỉ còn ${product.quantity_available} sản phẩm, không đủ số lượng yêu cầu.`
//             );
//           }
//         })
//       );
//       const result = await Promise.all(checkStockPromises);
//       const updates = orderItems.map((item) =>
//         Book.findOneAndUpdate(
//           { _id: item.product },
//           { $inc: { quantity_available: -item.amount } },
//           { new: true }
//         ).then((updatedProduct) => {
//           if (!updatedProduct) {
//             throw new Error(
//               `Sản phẩm ${item.name} không tồn tại hoặc không đủ số lượng trong kho.`
//             );
//           }
//           return updatedProduct;
//         })
//       );

//       await Promise.all(updates);
//       const createOrder = await Order.create(newOrder);
//       await sendEmailCreateOrder(createOrder);
//       res(createOrder);
//     } catch (error) {
//       rej(error);
//     }
//   });
// };
//

const createOrder = async (newOrder) => {
  const { orderItems } = newOrder;
  const session = await mongoose.startSession();
  session.startTransaction();
  const accquireProduct = [];
  for (const orderItem of orderItems) {
    const { amount, product } = orderItem;
    const keyLock = await acquireLock(product, amount, session);
    accquireProduct.push(keyLock ? true : false);
    if (keyLock) {
      await releaseLock(keyLock);
    } else {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestError(` ${orderItem?.name} Không đủ hàng`);
    }
  }
  // if (accquireProduct.includes(false)) {
  //   throw new BadRequestError("Không đủ hàng");
  // }
  await session.commitTransaction();
  session.endSession();
  await sendOrderToKafka(newOrder);

  return await Order.create(newOrder);

  const createOrder = await Order.create(newOrder);
  // await sendEmailCreateOrder(createOrder);
  return createOrder;
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

module.exports = {
  createOrder,
  checkQuantityStock,
};
