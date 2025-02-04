const { getContactsData } = require('../utils/getContactsUtils');
const { getContactByIdFromService, updateContactInService, deleteContactFromService, createContactInService } = require('../services/contacts');
const createError = require('http-errors');
const { contactValidationSchema, updateContactValidationSchema } = require('../models/contactSchema');

const getContacts = async (req, res, next) => {
  try {
    console.log("Received request for contacts");

    const data = await getContactsData(req.query);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    console.error("Error in getContacts:", error);
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactByIdFromService(contactId);

    if (!contact) return next(createError(404, 'Contact not found'));

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error("Error in getContactById:", error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const { error } = updateContactValidationSchema.validate(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const updatedContact = await updateContactInService(contactId, { name, phoneNumber, email, isFavourite, contactType });

    if (!updatedContact) return next(createError(404, 'Contact not found'));

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error in updateContact:", error);
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    console.log("Request body for createContact:", req.body);

    const { error } = contactValidationSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details);
      return next(createError(400, error.details[0].message));
    }

    const newContact = await createContactInService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error("Error in createContact:", error);
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContactFromService(contactId);

    if (!deletedContact) return next(createError(404, 'Contact not found'));

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteContact:", error);
    next(error);
  }
};

module.exports = { getContacts, getContactById, updateContact, deleteContact, createContact };
