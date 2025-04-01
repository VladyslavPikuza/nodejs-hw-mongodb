const { getContactsData } = require("../utils/getContactsUtils");
const {
  getContactByIdFromService,
  updateContactInService,
  deleteContactFromService,
  createContactInService,
} = require("../services/contacts");
const createError = require("http-errors");
const cloudinary = require("../utils/cloudinary");

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
  let updatedData = { ...req.body };

  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "contacts" });
    updatedData.photo = uploadResult.secure_url;
  }

  const updatedContact = await updateContactInService(contactId, updatedData, req.user._id);

  if (!updatedContact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json({
    status: 200,
    message: "Contact updated successfully",
    data: updatedContact,
  });
};

const cleanString = (str) => str.replace(/[\t\r\n]/g, '').trim();

const createContact = async (req, res, next) => {
  try {
    const cleanedData = {
      name: cleanString(req.body.name),
      phoneNumber: cleanString(req.body.phoneNumber),
      email: req.body.email ? req.body.email.trim() : "",
      isFavourite: req.body.isFavourite,
      contactType: req.body.contactType,
    };

    let photoUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "contacts" });
      photoUrl = uploadResult.secure_url;
    }

    const newContact = await createContactInService({ ...cleanedData, userId: req.user._id, photo: photoUrl });
    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res) => {
  const deletedContact = await deleteContactFromService(req.params.contactId, req.user._id);

  if (!deletedContact) throw createError(404, "Contact not found");

  res.status(204).send();
};


module.exports = { getContacts, getContactById, updateContact, deleteContact, createContact,};
