const router = require("express").Router();
const {
  getCoupons,
  addCoupon,
  editCoupon,
  getCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(authMiddleware, isAdmin, getCoupons)
  .post(authMiddleware, isAdmin, addCoupon);

router
  .route("/:id")
  .put(authMiddleware, isAdmin, editCoupon)
  .get(authMiddleware, isAdmin, getCoupon)
  .delete(authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
