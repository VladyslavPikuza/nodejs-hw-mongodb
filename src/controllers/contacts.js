const { getContactsData } = require("../utils/getContactsUtils");
const {
  getContactByIdFromService,
  updateContactInService,
  deleteContactFromService,
  createContactInService,
} = require("../services/contacts");
const createError = require("http-errors");

const getContacts = async (req, res) => {
  if (!req.user?._id) {
    throw createError(401, "Unauthorized: No user ID found");
  }

  const data = await getContactsData({ userId: req.user._id, ...req.query });

  res.status(200).json({
    status: 200,
    message: "Contacts retrieved successfully",
    data,
  });
};

const getContactById = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await getContactByIdFromService(contactId, req.user._id);
  if (!contact) throw createError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Contact retrieved successfully",
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const updatedContact = await updateContactInService(
    contactId,
    { name, phoneNumber, email, isFavourite, contactType },
    req.user._id
  );

  if (!updatedContact) throw createError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Contact updated successfully",
    data: updatedContact,
  });
};

const createContact = async (req, res) => {
  const newContact = await createContactInService({ ...req.body, userId: req.user._id });

  res.status(201).json({
    status: 201,
    message: "Contact created successfully",
    data: newContact,
  });
};

const deleteContact = async (req, res) => {
  const deletedContact = await deleteContactFromService(req.params.contactId, req.user._id);

  if (!deletedContact) throw createError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Contact deleted successfully",
  });
};

module.exports = { getContacts, getContactById, updateContact, deleteContact, createContact };
