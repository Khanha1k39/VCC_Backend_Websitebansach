"use strict";

const { ReasonPhrases } = require("./httpStatusCode");
const reasonPhrases = require("./reasonPhrases");
const statusCodes = require("./statusCodes");

class Response {
  constructor({
    message,
    statusCode = statusCodes.OK,
    metadata,
    reasonStatusCode = reasonPhrases.OK,
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

module.exports = Response;
