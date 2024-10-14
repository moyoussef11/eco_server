const mongoose = require("mongoose");
const joi = require("joi");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required: true,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
    totalRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

function validationCreateProduct(obj) {
  const schema = joi.object({
    title: joi.string().trim().required().min(2),
    description: joi.string().trim().required(),
    price: joi.number().required(),
    quantity: joi.number().required(),
    category: joi.string().trim().required().lowercase(),
    brand: joi.string().trim().required(),
    sold: joi.number(),
    images: joi.array(),
    color: joi.string().trim().required(),
  });
  return schema.validate(obj);
}

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, validationCreateProduct };
