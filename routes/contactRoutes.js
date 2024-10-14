const router = require("express").Router();
const {
  getContacts,
  addContact,
  deleteContact,
} = require("../controllers/contactController");

router.route("/").get(getContacts).post(addContact);

router.delete("/:id", deleteContact);

module.exports = router;
