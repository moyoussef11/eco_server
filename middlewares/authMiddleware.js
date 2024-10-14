const jwt = require("jsonwebtoken");
const statusTexts = require("../utils/statusTexts");

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({
      status: statusTexts.error,
      msg: "not token provided and UNAUTHORIZED",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: statusTexts.error, msg: "UNAUTHORIZED" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = {
    id: decoded.id,
    name: decoded.name,
    role: decoded.role,
    email: decoded.email,
  };
  next();
};

const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === "user") {
    return res
      .status(403)
      .json({ status: statusTexts.fail, msg: "not allowed only admin" });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
