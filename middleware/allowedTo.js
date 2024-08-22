const appError = require("../utils/appError");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.curUser.role)) {
        return next(
            appError.creat("this role not authorized", 401)
      );
      }
      next();
  };
};
