const User = require("../models/UserModel");
const jwtService = require("./jwtService");
const bcrypt = require("bcrypt");
const createUser = async (newUser) => {
  return new Promise(async (res, rej) => {
    const { name, email, password, confirmPassword, isAdmin = false } = newUser;

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin,
      });
      console.log(createdUser);
      if (createUser) {
        res({ status: "OK", message: "SUCCESS", data: createdUser });
      }
    } catch (error) {
      rej(error);
    }
  });
};
const login = ({ email, password }) => {
  return new Promise(async (res, rej) => {
    try {
      const user = await User.findOne({ email });

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
      rej(error);
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
const refreshToken = (token) => {
  return new Promise(async (res, rej) => {
    try {
      // const user = await User.findById(userId);
      // if (!user) {
      //   res({
      //     status: "OK",
      //     message: "The user is not defined",
      //   });
      // }
      console.log("cookie", req.cookie);
      res({ status: "OK", message: "Success", data: token });
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = {
  refreshToken,
  createUser,
  login,
  updateUser,
  getAllUser,
  getDetailUser,
};
