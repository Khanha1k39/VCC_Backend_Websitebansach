const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const createOrder = async (newOrder) => {
  return new Promise(async (res, rej) => {
    // const { name, image, type, price, countInStock, rating, description } =
    //   newProduct;
    return res({ hihi });

    try {
      const createBook = await Book.create(newProduct);
      if (createBook) {
        res({ status: "OK", message: "SUCCESS", data: createBook });
      }
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};

module.exports = {
  createOrder,
};
