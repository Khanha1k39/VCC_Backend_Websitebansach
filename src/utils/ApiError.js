class ApiError extends Error {
  constructor(status, message) {
    super(message);

    this.name = "ApiError";

    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
