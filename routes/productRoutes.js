const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCount,
  addToWishlist,
  uploadUpdateImagesProduct,
  getProduct,
  rateProduct,
  totalRatingProduct,
  addToCart,
  getCart,
  deleteCart,
} = require("../controllers/productController");
const uploadImageMulter = require("../middlewares/uploadImage");

router
  .route("/")
  .get(getProducts)
  .post(
    authMiddleware,
    isAdmin,
    uploadImageMulter.array("images", 12),
    createProduct
  );
router.post("/wishlist", authMiddleware, addToWishlist);

router
  .route("/cart")
  .post(authMiddleware, addToCart)
  .get(authMiddleware, getCart);

router.route("/cart/:id").delete(authMiddleware, deleteCart);

router.get("/count", getCount);

router
  .route("/:id")
  .get(getProduct)
  .patch(authMiddleware, isAdmin, updateProduct)
  .delete(authMiddleware, isAdmin, deleteProduct);

router.put(
  "/:id/upload",
  authMiddleware,
  isAdmin,
  uploadImageMulter.array("images", 12),
  uploadUpdateImagesProduct
);

router.put("/:id/rateProduct", authMiddleware, rateProduct);
router.get("/:id/totalRateProduct", totalRatingProduct);

module.exports = router;
