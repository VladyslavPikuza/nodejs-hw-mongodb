const { Contact } = require('../models/contacts');

const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching contacts: ' + error.message);
  }
};

const getContactByIdFromService = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching contact: ' + error.message);
  }
};

module.exports = { getAllContacts, getContactByIdFromService };
