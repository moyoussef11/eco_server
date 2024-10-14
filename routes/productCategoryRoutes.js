const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  getProductCategories,
  addCategory,
  editCategory,
  getCategory,
  deleteCategory,
} = require("../controllers/productCategoryController");

router
  .route("/")
  .get(getProductCategories)
  .post(authMiddleware, isAdmin, addCategory);
router
  .route("/:id")
  .put(authMiddleware, isAdmin, editCategory)
  .get(getCategory)
  .delete(authMiddleware, isAdmin, deleteCategory);

module.exports = router;
