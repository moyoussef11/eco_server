const mongoose = require("mongoose");
const Joi = require("joi");

const productCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

function validateProductCat(obj) {
  const schema = Joi.object({
    title: Joi.string().required().trim().uppercase(),
  });
  return schema.validate(obj);
}

module.exports = { ProductCategory, validateProductCat };
