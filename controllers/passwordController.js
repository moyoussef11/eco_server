const asyncHandler = require("express-async-handler");
const { User, validateEmail, validateNewPassword } = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const VerificationToken = require("../models/VerificationToken");
const sendEmail = require("../utils/sendEmail");
const statusTexts = require("../utils/statusTexts");

const resetPasswordLink = asyncHandler(async (req, res) => {
  const { error } = validateEmail(req.body);
  const { email } = req.body;
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "User not found" });
  }
  let verificationToken = await VerificationToken.findOne({
    userId: user._id,
  });
  if (!verificationToken) {
    verificationToken = await VerificationToken.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
  }
  const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
    }
    .header h1 {
      color: #4CAF50;
    }
    .content {
      margin: 20px 0;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #333;
    }
    .btn {
      display: inline-block;
      padding: 15px 30px;
      font-size: 16px;
      color: white !important;
      background-color: black;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to proceed:</p>
      <a href="${link}" class="btn">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>support team</p>
    </div>
  </div>
</body>
</html>
`;
  await sendEmail(email, "reset your password", htmlTemplate);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "please check your email " });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { userId, token } = req.params;
  const { error } = validateNewPassword(req.body);
  const { password } = req.body;
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  let user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "Invalid Link" });
  }
  const verificationToken = await VerificationToken.findOne({
    userId,
    token,
  });
  if (!verificationToken) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "Invalid Link" });
  }
  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user = await User.findByIdAndUpdate(userId, {
    password: hashPassword,
  });
  await verificationToken.deleteOne();
  res.status(200).json({
    status: statusTexts.success,
    msg: "password reset successfully please login",
  });
});

module.exports = { resetPasswordLink, resetPassword };
