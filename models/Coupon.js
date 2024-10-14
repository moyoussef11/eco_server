const mongoose = require("mongoose");
const Joi = require("joi");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

function validateCreateCoupon(obj) {
  const schema = Joi.object({
    name: Joi.string().required().trim().uppercase(),
    expiry: Joi.string().required(),
    discount: Joi.number().required(),
  });
  return schema.validate(obj);
}

module.exports = { Coupon, validateCreateCoupon };
