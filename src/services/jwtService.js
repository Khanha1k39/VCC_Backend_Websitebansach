const jwt = require("jsonwebtoken");
const generalAccessToken = (payload) => {
  const accessToken = jwt.sign({ ...payload }, "access_token", {
    expiresIn: "30s",
  });
  return accessToken;
};
const generalRefreshToken = (payload) => {
  const accessToken = jwt.sign({ ...payload }, "refresh_token", {
    expiresIn: "365d",
  });
  return accessToken;
};
const refreshToken = async (token) => {
  //   const accessToken = jwt.sign({ payload }, "access_token", {
  //     expiresIn: "365d",
  //   });
  return new Promise(async (res, rej) => {
    try {
      jwt.verify(token, "refresh_token", (err, user) => {
        if (err) {
          console.log(err);
          res({
            status: "Error",
            message: "The authentication",
          });
        }
        const access_token = generalAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        res({ status: "OK", message: "Success", access_token });
      });
    } catch (error) {
      console.log("error", error);

      rej(error);
    }
  });
};
module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshToken,
};
