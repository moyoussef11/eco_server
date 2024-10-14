const { validationCreateProduct, Product } = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { User } = require("../models/User");
const fs = require("fs");
const { cloudinaryUploadImages } = require("../utils/cloudinary");
const statusTexts = require("../utils/statusTexts");
const { Cart } = require("../models/Cart");

const getProducts = asyncHandler(async (req, res) => {
  let products;
  const PRODUCT_PER_PAGE = 5;
  const { pageNumber, category } = req.query;
  if (pageNumber && pageNumber > 0) {
    // {{url}}/products?pageNumber=1
    const skip = (pageNumber - 1) * PRODUCT_PER_PAGE;
    products = await Product.find().skip(skip).limit(PRODUCT_PER_PAGE);
  } else if (category) {
    products = await await Product.find({ category });
  } else {
    products = await Product.find();
  }
  res.status(200).json({ status: statusTexts.success, products });
});

const getCount = asyncHandler(async (req, res) => {
  const count = await await Product.find();
  res.status(200).json({ status: statusTexts.success, count: count.length });
});

const createProduct = asyncHandler(async (req, res) => {
  const { error } = validationCreateProduct(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  if (!req.files || req.files.length == 0) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "not provide file" });
  }
  const { title, description, price, quantity, category, brand, color } =
    req.body;
  const imagesPath = req.files.map((image) => image.path);
  const deployImages = await cloudinaryUploadImages(imagesPath);
  const images = deployImages.map((url) => url.secure_url);
  const slug = (req.body.slug = await slugify(req.body.title));
  const product = await Product.create({
    title,
    slug,
    description,
    price,
    quantity,
    category,
    color,
    brand,
    images,
  });
  res.status(201).json({
    status: statusTexts.success,
    product,
    msg: "created successfully",
  });
  await imagesPath.forEach((path) => {
    fs.unlinkSync(path);
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "product not found" });
  }
  res.status(200).json({ status: statusTexts.success, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = await slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ status: statusTexts.success, product: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.status(200).json({
    status: statusTexts.success,
    product: product,
    msg: "deleted successfully",
  });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  let user = await User.findById(userId);
  const alreadyAddedToWishlist = user.wishlist.includes(productId);
  if (alreadyAddedToWishlist) {
    user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { wishlist: productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: statusTexts.success,
      msg: "removed to wishlist successfully",
    });
  } else {
    user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { wishlist: productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: statusTexts.success,
      msg: "added to wishlist successfully",
    });
  }
});

const uploadUpdateImagesProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "Product not fount" });
  }
  if (!req.files || req.files.length == 0) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "not provide file" });
  }
  const imagesPath = req.files.map((image) => image.path);
  const deployImages = await cloudinaryUploadImages(imagesPath);
  const images = deployImages.map((url) => url.secure_url);
  product = await Product.findByIdAndUpdate(
    id,
    {
      images,
    },
    { new: true }
  );
  res.status(200).json({
    status: statusTexts.success,
    msg: "uploaded Images successfully",
  });
  await imagesPath.forEach((path) => {
    fs.unlinkSync(path);
  });
});

const rateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { rate } = req.body;
  let product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "product not found" });
  }
  const alreadyRate = product.ratings.some(
    (rating) =>
      rating.star === rate && rating.postedBy.toString() === userId.toString()
  );
  if (!alreadyRate) {
    product = await Product.findByIdAndUpdate(
      id,
      {
        $push: { ratings: { star: rate, postedBy: userId } },
      },
      { new: true }
    );
    return res.status(200).json({
      status: statusTexts.success,
      msg: "done rate",
      product,
    });
  } else {
    product = await Product.findByIdAndUpdate(
      id,
      {
        $pull: { ratings: { star: rate, postedBy: userId } },
      },
      { new: true }
    );
    return res.status(200).json({
      status: statusTexts.success,
      msg: "done unrate",
      product,
    });
  }
});

const totalRatingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let sum = 0;
  let product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "product not found" });
  }
  const arrNums = product.ratings.map((rate) => rate.star);
  arrNums.forEach((num) => (sum = sum + num));
  const total = sum / arrNums.length >= 5 ? 5 : sum / arrNums.length;
  if (total) {
    product = await Product.findByIdAndUpdate(id, { totalRate: total });
  }
  res.status(200).json({
    status: statusTexts.success,
    total,
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, price } = req.body;
  let cart = await Cart.find({ userId, productId });
  if (cart.length > 0) {
    cart = await Cart.findOneAndUpdate(
      { userId, productId },
      { $inc: { quantity: 1 } },
      { new: true }
    );
  } else {
    cart = await Cart.create({ userId, productId, quantity, price });
  }
  res.status(200).json({
    status: statusTexts.success,
    msg: "added to cart",
    cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.find({ userId }).populate("productId");
  res.status(200).json({
    status: statusTexts.success,
    cart,
  });
});

const deleteCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Cart.findByIdAndDelete(id);
  res.status(200).json({
    status: statusTexts.success,
    msg: "deleted successfully",
  });
});

module.exports = {
  getProducts,
  getCount,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  uploadUpdateImagesProduct,
  rateProduct,
  totalRatingProduct,
  addToCart,
  getCart,
  deleteCart,
};
