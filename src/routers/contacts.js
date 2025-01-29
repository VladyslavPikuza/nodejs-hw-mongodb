const express = require('express');
const router = express.Router();
const { getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contacts');
const { createContact } = require('../controllers/contactsController');



router.get('/', getContacts);
router.get('/:contactId', getContactById);
router.post('/', createContact);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

module.exports = router;
