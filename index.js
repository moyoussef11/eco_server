require("dotenv").config();
const express = require("express");
const connectDB = require("./dp/connect");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1010;
const authRouter = require("./routes/authRoutes");
const passwordRouter = require("./routes/passwordRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const productCategoryRouter = require("./routes/productCategoryRoutes");
const blogRouter = require("./routes/blogRoutes");
const blogCategoryRouter = require("./routes/blogCategoryRoutes");
const couponRouter = require("./routes/couponRoutes");
const contactRouter = require("./routes/contactRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/password", passwordRouter);
app.use("/api/products", productRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/contacts", contactRouter);

const main = async () => {
  try {
    await connectDB(process.env.MONGO_URL).then(() => {
      console.log(`DP connected successfully`);
    });
    await app.listen(port, () => console.log(`app listing in port:${port} `));
  } catch (error) {
    console.log(error);
  }
};

main();
