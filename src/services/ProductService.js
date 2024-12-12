const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const createProduct = async (newProduct) => {
  return new Promise(async (res, rej) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

    try {
      const createBook = await Book.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
      });
      if (createBook) {
        res({ status: "OK", message: "SUCCESS", data: createBook });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const updateProduct = (bookId, data) => {
  return new Promise(async (res, rej) => {
    try {
      const checkBook = await Book.findOne({ _id: bookId });
      if (checkBook === null) {
        res({ status: "OK", message: "The book is not defined" });
      }

      const updatedBook = await Book.findByIdAndUpdate(bookId, data);

      res({ status: "ok", message: "Success", data: updatedBook });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};
const getDetailProduct = (bookId) => {
  return new Promise(async (res, rej) => {
    try {
      const detailBook = await Book.findOne({ _id: bookId });
      if (detailBook === null) {
        return res({ status: "OK", message: "The book is not defined" });
      }

      res({ status: "ok", message: "Success", data: detailBook });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};
const deleteProduct = (bookId) => {
  return new Promise(async (res, rej) => {
    try {
      const detailBook = await Book.findOne({ _id: bookId });
      if (detailBook === null) {
        return res({ status: "OK", message: "The book is not defined" });
      }
      const deletedBook = await Book.findByIdAndDelete(bookId);

      res({ status: "ok", message: "Success", data: detailBook });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};
const getAllProduct = (limit = 8, page = 1, sort) => {
  return new Promise(async (res, rej) => {
    try {
      const totalBook = await Book.countDocuments();
      const allBook = await Book.find()
        .limit(limit)
        .skip((page - 1) * limit);
      res({
        status: "ok",
        message: "Success",
        data: allBook,
        totalBook: totalBook,
        pageCurrent: page,
        totalPage: Math.ceil(totalBook / limit),
      });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
};
