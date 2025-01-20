const { Contact } = require('../models/Contact');

const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

module.exports = { getAllContacts };
