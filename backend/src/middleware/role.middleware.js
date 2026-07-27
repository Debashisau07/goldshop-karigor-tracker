const { errorResponse } = require("../utils/response");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return errorResponse(
      res,
      403,
      "Access denied. Admins only."
    );
  }
};

const managerOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "manager" || req.user.role === "admin")
  ) {
    next();
  } else {
    return errorResponse(
      res,
      403,
      "Access denied."
    );
  }
};

module.exports = { adminOnly, managerOrAdmin };