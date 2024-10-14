const mongoose = require("mongoose");
const Joi = require("joi");

const blogCategorySchema = new mongoose.Schema(
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

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

function validateBlogCat(obj) {
  const schema = Joi.object({
    title: Joi.string().required().trim().uppercase(),
  });
  return schema.validate(obj);
}

module.exports = { BlogCategory, validateBlogCat };
