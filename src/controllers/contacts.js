const { getAllContacts, getContactByIdFromService } = require('../services/contacts');
const { updateContactInService } = require('../services/contacts');
const { deleteContactFromService } = require('../services/contacts');

const createError = require('http-errors');

const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching contacts',
    });
  }
};


const getContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactByIdFromService(contactId);

    if (contact) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } else {
      throw createError(404, 'Contact not found');
    }
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;


    const updatedContact = await updateContactInService(contactId, { name, phoneNumber, email, isFavourite, contactType });

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await deleteContactFromService(contactId);

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};

module.exports = { getContacts, getContactById, updateContact, deleteContact };


