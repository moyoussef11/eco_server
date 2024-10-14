const asyncHandler = require("express-async-handler");
const { Coupon, validateCreateCoupon } = require("../models/Coupon");
const statusTexts = require("../utils/statusTexts");

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ status: statusTexts.success, coupons });
});

const addCoupon = asyncHandler(async (req, res) => {
  const { error } = validateCreateCoupon(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ status: statusTexts.success, coupon });
});

const editCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Coupon.findByIdAndUpdate(id, req.body);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "updated successfully" });
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "coupon not found" });
  }
  res.status(200).json({ status: statusTexts.success, coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "coupon not found" });
  }
  await Coupon.findByIdAndDelete(id);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "deleted successfully" });
});

module.exports = { getCoupons, getCoupon, addCoupon, editCoupon, deleteCoupon };
