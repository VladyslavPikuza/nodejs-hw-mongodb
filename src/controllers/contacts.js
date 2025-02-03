const { getAllContacts, getContactByIdFromService, updateContactInService, deleteContactFromService, createContactInService } = require('../services/contacts');
const createError = require('http-errors');

const getContacts = async (req, res, next) => {
  try {
    console.log("Received request for contacts");
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const totalItems = await getAllContacts();
    const totalPages = Math.ceil(totalItems.length / perPage);
    const contacts = await getAllContacts().skip(skip).limit(perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems: totalItems.length,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
      }
    });
  } catch (error) {
    console.error("Error in getContacts:", error);
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await getContactByIdFromService(contactId);

  if (!contact) return next(createError(404, 'Contact not found'));

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const updatedContact = await updateContactInService(contactId, { name, phoneNumber, email, isFavourite, contactType });

  if (!updatedContact) return next(createError(404, 'Contact not found'));

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

const createContact = async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    return next(createError(400, 'Missing required fields: name, phoneNumber, or contactType'));
  }

  const newContact = await createContactInService({ name, phoneNumber, email, isFavourite, contactType });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactFromService(contactId);

  if (!deletedContact) return next(createError(404, 'Contact not found'));

  res.status(204).send();
};

module.exports = { getContacts, getContactById, updateContact, deleteContact, createContact };
