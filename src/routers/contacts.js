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

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(contactValidationSchema), ctrlWrapper(createContact)); 
router.patch('/:contactId', isValidId, validateBody(updateContactValidationSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

module.exports = router;


