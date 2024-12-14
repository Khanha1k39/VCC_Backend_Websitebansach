const UserService = require("../services/UserService");
const jwtService = require("../services/jwtService");

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const data = await UserService.createUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const data = await UserService.login(req.body);
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error });
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
    return res.status(200).json(data);
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
    return res.status(200).json(data);
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
    const token = req.headers.token?.split(" ")[1];
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
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
};
