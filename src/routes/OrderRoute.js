const express = require("express");
const orderController = require("../controllers/OrderController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../middlewares/asyncHandler");
const router = express.Router();
router.post("/create", asyncHandler(orderController.createOrder));
router.post("/check", orderController.checkQuantityStock);

module.exports = router;
