const User = require("../models/UserModel");
const jwtService = require("./jwtService");
const bcrypt = require("bcrypt");
const createUser = async ({ email, password }) => {
  return new Promise(async (res, rej) => {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res({
          status: "ERR",
          message: "Người dùng đã tồn tại với email này.",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        email,
        password: hashedPassword,
      });

      if (createdUser) {
        res({ status: "OK", message: "SUCCESS", data: createdUser });
      }
    } catch (error) {
      rej(error);
    }
  });
};

const login = async ({ email, password }) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return rej({ message: "Người dùng không tồn tại", status: "ERR" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return rej({ message: "Mật khẩu không đúng", status: "ERR" });
      }

      const access_token = jwtService.generalAccessToken({
        id: user._id,
        isAdmin: user.isAdmin,
      });
      const refresh_token = jwtService.generalRefreshToken({
        id: user._id,
        isAdmin: user.isAdmin,
      });

      res({ access_token, refresh_token });
    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      rej({ message: "Lỗi máy chủ", status: 500 });
    }
  });
};
const updateUser = (userId, user) => {
  return new Promise(async (res, rej) => {
    const { name, email, password, confirmPassword } = user;
    try {
      const userCheck = await User.findById(userId);
      if (!userCheck) {
        res({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const updateUser = await User.findByIdAndUpdate(userId, user, {
        new: true,
      });
      res({ data: updateUser });
    } catch (error) {
      rej(error);
    }
  });
};
const deleteUser = (userId) => {
  return new Promise(async (res, rej) => {
    try {
      const userCheck = await User.findById(userId);
      if (!userCheck) {
        res({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const deletedUser = await User.findByIdAndDelete(userId);
      res({ data: deletedUser });
    } catch (error) {
      rej(error);
    }
  });
};
const getAllUser = () => {
  return new Promise(async (res, rej) => {
    try {
      const users = await User.find();

      res({ data: users });
    } catch (error) {
      rej(error);
    }
  });
};
const getDetailUser = (userId) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        res({
          status: "OK",
          message: "The user is not defined",
        });
      }
      res({ status: "OK", message: "Success", data: user });
    } catch (error) {
      rej(error);
    }
  });
};

module.exports = {
  createUser,
  login,
  updateUser,
  getAllUser,
  getDetailUser,
};
