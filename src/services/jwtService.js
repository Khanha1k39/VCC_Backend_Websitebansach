const jwt = require("jsonwebtoken");
const generalAccessToken = (payload) => {
  const accessToken = jwt.sign({ payload }, "access_token", {
    expiresIn: "1h",
  });
  return accessToken;
};
const generalRefreshToken = (payload) => {
  const accessToken = jwt.sign({ payload }, "refresh_token", {
    expiresIn: "365d",
  });
  return accessToken;
};
const refreshToken = async (token) => {
  const accessToken = jwt.sign({ payload }, "access_token", {
    expiresIn: "365d",
  });
  return new Promise(async (res, rej) => {
    try {
      console.log(token);
      jwt.verify(token, " refresh_token", (err, user) => {
        if (err) {
          res({
            status: "Error",
            message: "The authentication",
          });
          console.log(user);
          const { payload } = user;
          const access_token = generalAccessToken({
            id: payload?.id,
            isAdmin: payload?.isAdmin,
          });
          res({ status: "OK", message: "Success", access_token });
        }
      });
    } catch (error) {
      rej(error);
    }
  });
  return accessToken;
};
module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshToken,
};
