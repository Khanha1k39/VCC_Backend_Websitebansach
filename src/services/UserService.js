const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const createUser = async (newUser) => {
  return new Promise(async (res, rej) => {
    const { name, email, password, confirmPassword } = newUser;

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
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
const login = (user) => {
  return new Promise(async (res, rej) => {
    const { name, email, password, confirmPassword } = user;
    try {
      const user = await User.findOne({ email });
      res(user);
    } catch (error) {
      rej(error);
    }
  });
};
module.exports = { createUser, login };
