const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const statusTexts = require("../utils/statusTexts");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: statusTexts.success, users, count: users.length });
});

const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate("wishlist");
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "user not found" });
  }
  res.status(200).json({ status: statusTexts.success, user });
});

const updateUser = asyncHandler(async (req, res) => {
  let newPassword;
  const { username, email, password } = req.body;
  const { id } = req.params;
  const loggedUser = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "user not found" });
  }
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    newPassword = await bcrypt.hash(password, salt);
  }

  if (loggedUser !== id) {
    return res.status(403).json({
      status: statusTexts.fail,
      msg: "not allowed update only user himself",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, email, password: newPassword },
    { new: true }
  );
  res.status(200).json({ status: statusTexts.success, user: updatedUser });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const loggedUser = req.user.id;
  const role = req.user.role;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "user not found" });
  }
  if (loggedUser === id || role === "admin") {
    await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: statusTexts.success, msg: "deleted successfully" });
  } else {
    return res.status(403).json({
      status: statusTexts.fail,
      msg: "not allowed delete only user himself and admin",
    });
  }
});

const blockedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({
      status: statusTexts.fail,
      msg: "not allowed delete only admin",
    });
  }
  const block = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.status(200).json({
    status: statusTexts.success,
    msg: "Blocked User successfully",
    user: block,
  });
});

const unblockedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({
      status: statusTexts.fail,
      msg: "not allowed delete only admin",
    });
  }
  const unblock = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.status(200).json({
    status: statusTexts.success,
    msg: "unblocked User successfully",
    user: unblock,
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  blockedUser,
  unblockedUser,
};
