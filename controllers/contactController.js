const asyncHandler = require("express-async-handler");
const statusTexts = require("../utils/statusTexts");
const { Contact, validationCreateContact } = require("../models/Contact");

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({ status: statusTexts.success, contacts });
});

const addContact = asyncHandler(async (req, res) => {
  const { error } = validationCreateContact(req.body);
  const { email } = req.body;
  if (error) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: error.message });
  }
  const alreadyExist = await Contact.findOne({ email });
  if (alreadyExist) {
    return res
      .status(400)
      .json({ status: statusTexts.error, msg: "email already in use" });
  }
  const contact = await Contact.create(req.body);
  res.status(200).json({ status: statusTexts.success, contact });
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Contact.findByIdAndDelete(id);
  res
    .status(200)
    .json({ status: statusTexts.success, msg: "deleted successfully" });
});

module.exports = { getContacts, addContact, deleteContact };
