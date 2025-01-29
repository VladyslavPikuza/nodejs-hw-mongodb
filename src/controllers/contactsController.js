const createError = require('http-errors');
const { createContactInService } = require('../services/contacts');

const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;


    console.log('Received data:', req.body);

    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
    }

    const newContact = await createContactInService({ name, phoneNumber, email, isFavourite, contactType });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    next(error);
  }
};


module.exports = { createContact };
