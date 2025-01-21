const Contact = require('../models/Contact');


const getContactById = async (req, res) => {
  const { contactId } = req.params; 
  try {
    const contact = await Contact.findById(contactId); 

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' }); 
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
};

module.exports = { getContactById }; 

