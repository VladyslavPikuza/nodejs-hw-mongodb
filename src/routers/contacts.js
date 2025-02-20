const express = require('express');
const router = express.Router();
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const { contactValidationSchema, updateContactValidationSchema } = require('../models/contactSchema');
const authenticate  = require('../middlewares/authenticate');

const {
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  createContact
} = require('../controllers/contacts');


router.get('/', authenticate, ctrlWrapper(getContacts));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactById));
router.post('/', authenticate, validateBody(contactValidationSchema), createContact);
router.patch('/:contactId', authenticate, isValidId, validateBody(updateContactValidationSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContact));


module.exports = router;


