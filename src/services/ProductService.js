const Book = require("../models/BookModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { default: ApiError } = require("../utils/ApiError");
const statusCodes = require("../core/statusCodes");
const { BadRequestError } = require("../core/error.response");
const redisClient = require("../dbs/redis");
const createProduct = async (newProduct) => {
  console.log(newProduct);
  return new Promise(async (res, rej) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

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
const updateProduct = (bookId, data) => {
  console.log("update   book id :", bookId, "data ", data);
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
// const getDetailProduct = async (bookId) => {
//   const detailBook = await Book.findOne({ _id: bookId });
//   if (detailBook === null) {
//     return "The book is not defined";
//   }
//   return detailBook;
// };
const getDetailProduct = async (bookId) => {
  const client = redisClient.getClient();
  const cacheKey = `book_detail_${bookId}`;

  const cachedBook = await client.get(cacheKey);

  if (cachedBook) {
    if (cachedBook === "null") {
      throw new BadRequestError("Book not found");
    }
    const parsedBook = JSON.parse(cachedBook);
    console.log(cachedBook);
    return parsedBook;
  }

  // Khoa lai
  const retryTimes = 10;
  const expireTime = 3;
  const keyLock = "MUTEX_KEY" + bookId;
  for (let i = 0; i < retryTimes; i++) {
    const result = await client.set(keyLock, expireTime, {
      NX: true,
      EX: expireTime,
    });
    console.log(`result:::`, result);
    if (result) {
      const detailBook = await Book.findOne({ _id: bookId });
      if (detailBook) {
        // Cache for 1 hour (3600 seconds)
        await client.setEx(cacheKey, 3600, JSON.stringify(detailBook));
        await client.del(keyLock);
        return detailBook;
      } else {
        await client.del(keyLock);

        await client.setEx(cacheKey, 3600, "null");
        throw new BadRequestError("Book not found");
      }
      // return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const cachedBook = await client.get(cacheKey);

      if (cachedBook) {
        if (cachedBook === "null") {
          throw new BadRequestError("Book not found");
        }
        const parsedBook = JSON.parse(cachedBook);
        console.log(cachedBook);
        return parsedBook;
      }
    }
  }

  return null;
};

const deleteProduct = (bookId) => {
  console.log("is deleting book");
  return new Promise(async (res, rej) => {
    try {
      const detailBook = await Book.findOne({ _id: bookId });
      if (detailBook === null) {
        return res({ status: "OK", message: "The book is not defined" });
      }
      const deletedBook = await Book.findByIdAndDelete(bookId);

      res({ status: "ok", message: "Success", data: deletedBook });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};
const deleteManyProduct = (ids) => {
  console.log("ids", ids);

  return new Promise(async (res, rej) => {
    try {
      const deletedProduct = await Book.deleteMany({ _id: ids });

      res({ status: "ok", message: "Success", data: deletedProduct });
    } catch (error) {
      console.log(error);
      rej(error);
    }
  });
};
const getAllProduct = async (limit = 8, page = 1, sort) => {
  const totalBook = await Book.countDocuments();
  const allBook = await Book.find()
    .limit(limit)
    .skip((page - 1) * limit);
  return {
    data: allBook,
    totalBook: totalBook,
    pageCurrent: page,
    totalPage: Math.ceil(totalBook / limit),
  };
};

module.exports = {
  deleteManyProduct,
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
};
