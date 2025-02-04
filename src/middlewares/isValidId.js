const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  console.log('Contact ID:', contactId);  

  if (!isValidObjectId(contactId)) {
    return res.status(400).json({ status: 400, message: "Invalid contact ID" });
  }

  next();
};

module.exports = isValidId;
