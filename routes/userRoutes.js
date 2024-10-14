const router = require("express").Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  blockedUser,
  unblockedUser,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");

router.route("/").get(authMiddleware, isAdmin, getUsers);
router.get("/:id", authMiddleware, validateObjectId, getUser);
router.patch("/:id/edit", authMiddleware, validateObjectId, updateUser);
router.delete("/:id/delete", authMiddleware, validateObjectId, deleteUser);
router.patch(
  "/block-user/:id",
  authMiddleware,
  isAdmin,
  validateObjectId,
  blockedUser
);
router.patch(
  "/unblock-user/:id",
  authMiddleware,
  isAdmin,
  validateObjectId,
  unblockedUser
);

module.exports = router;
