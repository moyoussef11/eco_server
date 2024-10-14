const router = require("express").Router();
const {
  register,
  login,
  verifyEmail,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/:userId/verify/:token", verifyEmail);

module.exports = router;
