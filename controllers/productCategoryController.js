const asyncHandler = require("express-async-handler");
const {
  validateProductCat,
  ProductCategory,
} = require("../models/ProductCategory");
const statusTexts = require("../utils/statusTexts");

const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await ProductCategory.find();
  res.status(200).json({ status: statusTexts.success, categories });
});

const addCategory = asyncHandler(async (req, res) => {
  const { error } = validateProductCat(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const category = await ProductCategory.create(req.body);
  res.status(201).json({ status: statusTexts.success, category });
});

const editCategory = asyncHandler(async (req, res) => {
  const { error } = validateProductCat(req.body);
  const { id } = req.params;
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  await ProductCategory.findByIdAndUpdate(id, req.body);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "updated successfully" });
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await ProductCategory.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "category not found" });
  }
  res.status(200).json({ status: statusTexts.success, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await ProductCategory.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "category not found" });
  }
  await ProductCategory.findByIdAndDelete(id);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "deleted successfully" });
});

module.exports = {
  getProductCategories,
  addCategory,
  editCategory,
  getCategory,
  deleteCategory,
};
