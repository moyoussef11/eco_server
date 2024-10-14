const router = require("express").Router();
const {
  resetPasswordLink,
  resetPassword,
} = require("../controllers/passwordController");

router.post("/reset-password", resetPasswordLink);
router.post("/reset-password/:userId/:token", resetPassword);

module.exports = router;
