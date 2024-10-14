const router = require("express").Router();
const {
  getBlogCategories,
  addCategory,
  editCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/blogCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(getBlogCategories)
  .post(authMiddleware, isAdmin, addCategory);

router
  .route("/:id")
  .put(authMiddleware, isAdmin, editCategory)
  .get(getCategory)
  .delete(authMiddleware, isAdmin, deleteCategory);

module.exports = router;
