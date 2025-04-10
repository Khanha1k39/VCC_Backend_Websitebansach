import { StatusCodes } from "http-status-codes";
import { env } from "../config/enviroment.js";

export const errorHandlingMiddleware = (err, req, res, next) => {
  console.log(err);
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack,
  };

  if (env.BUILD_MODE !== "dev") delete responseError.stack;

  res.status(responseError.statusCode).json(responseError);
};
