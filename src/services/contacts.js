const { Contact } = require('../models/contacts');

const getAllContacts = async (filter, page, perPage, sortBy, sortOrder) => {
  try {
    const skip = (page - 1) * perPage;


    const contacts = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage);


    const totalItems = await Contact.countDocuments(filter); 
    return { contacts, totalItems };
  } catch (error) {
    console.error('Error fetching contacts:', error);
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

const createContactInService = async ({ name, phoneNumber, email, isFavourite, contactType }) => {
  try {
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating contact: ' + error.message);
  }
};

const updateContactInService = async (contactId, updateData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });

    if (!updatedContact) {
      return null;
    }

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Error updating contact: ' + error.message);
  }
};

const deleteContactFromService = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Error deleting contact: ' + error.message);
  }
};

module.exports = { getAllContacts, getContactByIdFromService, createContactInService, updateContactInService, deleteContactFromService };
