const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    cart: {
      type: Array,
      default: [],
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (passwordUser) {
  return await bcrypt.compare(passwordUser, this.password);
};

function validateRegister(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(15).required(),
    address: Joi.string().trim().min(3).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

function validateLogin(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

function validateEmail(obj) {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
  });
  return schema.validate(obj);
}

function validateNewPassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  validateRegister,
  validateLogin,
  validateEmail,
  validateNewPassword,
};
