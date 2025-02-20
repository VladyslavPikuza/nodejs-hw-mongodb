const { Contact } = require('../models/contacts');


const getAllContacts = async (userId, filter = {}, page = 1, perPage = 10, sortBy = "createdAt", sortOrder = "asc") => {
  try {
    console.log("User ID:", userId);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const skip = (Number(page) - 1) * Number(perPage);

    filter.userId = userId;

    const contacts = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(perPage));

    const totalItems = await Contact.countDocuments(filter);

    return { contacts, totalItems };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Error fetching contacts: " + error.message);
  }
};



const getContactByIdFromService = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching contact: ' + error.message);
  }
};


const createContactInService = async (contactData) => {
  try {
    console.log("Creating contact for user:", contactData.userId);

    const newContact = new Contact(contactData);
    await newContact.save();

    return newContact;
  } catch (error) {
    console.error("Error saving contact:", error);
    throw error;
  }
};


const updateContactInService = async (contactId, updateData, userId) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updateData,
      { new: true }
    );

    if (!updatedContact) {
      return null;
    }

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Error updating contact: ' + error.message);
  }
};


const deleteContactFromService = async (contactId, userId) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
    return deletedContact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Error deleting contact: ' + error.message);
  }
};

module.exports = { getAllContacts, getContactByIdFromService, createContactInService, updateContactInService, deleteContactFromService };

