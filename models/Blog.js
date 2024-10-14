const mongoose = require("mongoose");
const joi = require("joi");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2022/03/what-is-a-blog-1.png",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

function validateCreateBlog(obj) {
  const schema = joi.object({
    title: joi.string().trim().required().min(2),
    description: joi.string().trim().required().min(20),
    category: joi.string().trim().required(),
  });
  return schema.validate(obj);
}

module.exports = { Blog, validateCreateBlog };
