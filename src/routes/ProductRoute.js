const express = require("express");
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", productController.createProduct);
router.put("/update-roduct/:id", productController.updateProduct);
router.get("/get-all", productController.getAllProduct);
router.post(
  "/delete-many",
  authMiddleware,
  productController.deleteManyProduct
);

router.get("/:id", productController.getDetailProduct);

router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
