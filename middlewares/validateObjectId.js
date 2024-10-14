const mongoose = require("mongoose");
const statusTexts = require("../utils/statusTexts");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "Invalid ID" });
  }
  next();
};

module.exports = validateObjectId;
