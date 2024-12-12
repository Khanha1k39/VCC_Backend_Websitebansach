const express = require("express");
const productController = require("../controllers/ProductController");
const router = express.Router();
router.post("/create", productController.createProduct);
router.put("/updateproduct/:id", productController.updateProduct);
router.get("/get-all", productController.getAllProduct);

router.get("/:id", productController.getDetailProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
