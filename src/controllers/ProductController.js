const statusCodes = require("../core/statusCodes");
const Response = require("../core/success.response");
const ProductService = require("../services/ProductService");
const { default: ApiError } = require("../utils/ApiError");
const createProduct = async (req, res) => {
  try {
    const { title, image, type, price, countInStock, rating, description } =
      req.body;
    const data = await ProductService.createProduct(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const updateProduct = async (req, res) => {
  try {
    const bookId = req.params.id;
    const data = req.body;
    const { name, image, type, price, countInStock, rating, description } =
      req.body;

    const respone = await ProductService.updateProduct(bookId, data);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const getDetailProduct = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const respone = await ProductService.getDetailProduct(bookId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const respone = await ProductService.deleteProduct(bookId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    console.log("ids delete mant", req.body);

    const respone = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const getAllProduct = async (req, res, next) => {
  console.log("is getall product");
  const { limit, page, sort } = req.query;
  throw new ApiError(statusCodes.NOT_FOUND, "User expried");

  const respone = await ProductService.getAllProduct(
    Number(limit) || 8,
    Number(page) || 1
  );
  new Response({
    message: "Get all successfully",
    metadata: respone,
  }).send(res);
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
};
