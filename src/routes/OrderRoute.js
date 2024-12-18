const express = require("express");
const orderController = require("../controllers/OrderController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create", orderController.createOrder);
router.post("/check", orderController.checkQuantityStock);

module.exports = router;
