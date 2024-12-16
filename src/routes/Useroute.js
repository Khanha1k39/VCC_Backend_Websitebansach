const express = require("express");
const userController = require("../controllers/UserController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.get("/logout", userController.logout);

router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
// router.get("/delete-user/:id", userController.delete);
router.get("/getAll", authMiddleware, userController.getAllUser);
router.get("/get-detail/:id", authUserMiddleware, userController.getDetailUser);
router.get("/refresh-token", userController.refreshToken);

module.exports = router;
