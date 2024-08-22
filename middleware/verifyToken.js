const jwt = require("jsonwebtoken");
const httpStatustext = require("../utils/httpstatustxt");
const appError = require('../utils/appError');
const verifyToken = (req, res, next) => {
  const AuthHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!AuthHeader) {
    const error = appError.creat(
      "token is required",
      401,
      httpStatustext.ERROR
    );
    return next(error);
  }
  const token = AuthHeader.split(" ")[1];
  try {
    const curUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.curUser = curUser;
    next();
  } catch (err) {
    const error = appError.creat(
      "invalid token",
      401,
      httpStatustext.ERROR
    );
    return next(error);
  }
};
module.exports = verifyToken;
