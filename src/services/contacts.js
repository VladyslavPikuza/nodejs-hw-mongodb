const { Contact } = require('../models/Contact');

const fetchAllContacts = () => {
  return Contact.find();
};

module.exports = { fetchAllContacts };