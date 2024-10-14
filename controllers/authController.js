const asyncHandler = require("express-async-handler");
const { validateRegister, User, validateLogin } = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const VerificationToken = require("../models/VerificationToken");
const sendEmail = require("../utils/sendEmail");
const statusTexts = require("../utils/statusTexts");

const register = asyncHandler(async (req, res) => {
  const { error } = validateRegister(req.body);
  const { email } = req.body;
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "email already exists" });
  }
  const newUser = await User.create(req.body);
  //  verify Email
  // 1 create verificationToken and save to dp
  const verificationToken = await VerificationToken.create({
    userId: newUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  // 2 create Link
  const link = `${process.env.CLIENT_DOMAIN}/${newUser._id}/verify/${verificationToken.token}`;
  //  3 create htmlTemplate
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
      color: #eee !important;
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
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up. Please click the button below to verify your email address:</p>
      <a href="${link}" class="btn">Verify Email</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>support team</p>
    </div>
  </div>
</body>
</html>
`;
  //  4 send Email
  sendEmail(newUser.email, "verify your email", htmlTemplate);
  res.status(201).json({
    status: statusTexts.success,
    msg: `we sent to you an email ${newUser.email} , please verify your email`,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ status: statusTexts.error, msg: "user not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "password invalid" });
  }

  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });
    if (!verificationToken) {
      verificationToken = await new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();
    }
    //  verify Email
    // 1 create Link
    const link = `${process.env.CLIENT_DOMAIN}/${user._id}/verify/${verificationToken.token}`;
    //  2 create htmlTemplate
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
      color: #eee !important;
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
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up. Please click the button below to verify your email address:</p>
      <a href="${link}" class="btn">Verify Email</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Thank you,</p>
      <p>support team</p>
    </div>
  </div>
</body>
</html>
`;
    //  3 send Email
    sendEmail(user.email, "verify your email", htmlTemplate);
    res.status(200).json({
      status: statusTexts.success,
      msg: `we sent to you an email ${user.email} , please verify your email`,
    });
  }
  const token = await jwt.sign(
    {
      id: user._id,
      name: user.username,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  res.status(200).json({
    status: statusTexts.success,
    user,
    token,
    msg: "successful login",
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, token } = req.params;
  const verificationToken = await VerificationToken.findOne({
    userId,
    token,
  });
  if (!verificationToken) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "Invalid Link" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "Invalid Link" });
  }
  user.isAccountVerified = true;
  await user.save();
  await VerificationToken.deleteOne();
  res.status(200).json({
    status: statusTexts.success,
    msg: `your account email verified`,
  });
});

module.exports = { register, login, verifyEmail };
