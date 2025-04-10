const UserService = require("../services/UserService");
const jwtService = require("../services/jwtService");

const createUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(422).json({
      status: "ERR",
      message: "Email không hợp lệ.",
    });
  }

  if (!password || password.length < 6) {
    return res.status(422).json({
      status: "ERR",
      message: "Mật khẩu phải có ít nhất 6 ký tự.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({
      status: "ERR",
      message: "Mật khẩu và xác nhận mật khẩu không khớp.",
    });
  }
  try {
    console.log(req.body);
    const data = await UserService.createUser({
      email,
      password,
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error, message: error?.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(422).json({
        status: "ERR",
        message: "Email không hợp lệ.",
      });
    }

    if (!password || password.length < 6) {
      return res.status(422).json({
        status: "ERR",
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
    }
    const response = await UserService.login({ email, password });
    const { refresh_token, ...newRespone } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
    });
    return res.status(200).json(newRespone);
  } catch (error) {
    return res.status(404).json(error);
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "Err",
        message: "UserId is required",
      });
    }
    const data = req.body;
    const respone = await UserService.updateUser(userId, data);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "Err",
        message: "UserId is required",
      });
    }
    const respone = await UserService.deleteUser(userId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const getAllUser = async (req, res) => {
  try {
    const respone = await UserService.getAllUser();
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const respone = await UserService.getDetailUser(userId);

    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    console.log("refresh token", token);
    if (!token) {
      return res.status(200).json({
        status: "Err",
        message: "token is required",
      });
    }
    const respone = await jwtService.refreshToken(token);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const logout = async (req, res) => {
  try {
    console.log("refer from logout ", req.cookies?.refresh_token);
    res.clearCookie("refresh_token", {});
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
module.exports = {
  logout,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
};
