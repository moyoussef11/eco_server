const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  uploadBlogImage,
} = require("../controllers/blogController");
const validateObjectId = require("../middlewares/validateObjectId");
const uploadImageMulter = require("../middlewares/uploadImage");

router.route("/").get(getBlogs).post(authMiddleware, isAdmin, createBlog);
router.patch("/toggle-like", authMiddleware, toggleLike);

router
  .route("/:id")
  .get(validateObjectId, getBlog)
  .patch(authMiddleware, validateObjectId, isAdmin, updateBlog)
  .delete(authMiddleware, validateObjectId, isAdmin, deleteBlog);

router.patch(
  "/:id/upload",
  authMiddleware,
  validateObjectId,
  isAdmin,
  uploadImageMulter.single("image"),
  uploadBlogImage
);

module.exports = router;
