const asyncHandler = require("express-async-handler");
const { validateCreateBlog, Blog } = require("../models/Blog");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs = require("fs");
const statusTexts = require("../utils/statusTexts");

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({ status: statusTexts.success, blogs });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { numViews: 1 } },
    { new: true }
  );
  if (!blog) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "blog not found" });
  }
  res.status(200).json({ status: statusTexts.success, blog });
});

const createBlog = asyncHandler(async (req, res) => {
  const { error } = validateCreateBlog(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const blog = await Blog.create(req.body);
  res.status(201).json({ status: statusTexts.success, blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!blog) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "blog not found" });
  }
  res
    .status(200)
    .json({ status: statusTexts.success, blog, msg: "updated successfully!" });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "blog not found" });
  }
  const deletedBlog = await Blog.findByIdAndDelete(id);
  res.status(200).json({
    status: statusTexts.success,
    blog: deletedBlog,
    msg: "deleted successfully!",
  });
});

const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { blogId } = req.body;
  let blogToggleLike = await Blog.findById(blogId);
  if (blogToggleLike.likes.includes(userId)) {
    blogToggleLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
  } else {
    blogToggleLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: userId },
      },
      { new: true }
    );
  }
  res.status(200).json({ status: statusTexts.success, blog: blogToggleLike });
});

const uploadBlogImage = asyncHandler(async (req, res) => {
  const { id } = req.params;  
  if (!req.file) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "no file provided" });
  }
  const pathImage = req.file.path;
  const result = await cloudinaryUploadImage(pathImage);
  let blog = await Blog.findById(id);
  if (!blog) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "blog not found" });
  }
  blog = await Blog.findByIdAndUpdate(
    id,
    {
      image: result.secure_url,
    },
    { new: true }
  );
  res.status(200).json({
    status: statusTexts.success,
    msg: "uploaded Images successfully",
  });
  fs.unlinkSync(pathImage);
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  uploadBlogImage,
};
