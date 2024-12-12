const UserService = require("../services/UserService");
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
module.exports = { createUser, loginUser };
