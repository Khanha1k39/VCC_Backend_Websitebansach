const express = require("express");
const userController = require("../controllers/UserController");
const router = express.Router();
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);

module.exports = router;
