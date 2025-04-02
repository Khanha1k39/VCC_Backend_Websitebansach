const express = require("express");
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../middlewares/asyncHandler");
const router = express.Router();
router.post("/create", authMiddleware, productController.createProduct);
router.put(
  "/update-roduct/:id",
  authMiddleware,
  productController.updateProduct
);
router.get("/get-all", asyncHandler(productController.getAllProduct));
router.post(
  "/delete-many",
  authMiddleware,
  productController.deleteManyProduct
);

router.get("/:id", productController.getDetailProduct);

router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
