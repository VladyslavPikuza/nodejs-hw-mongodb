const { getAllContacts, getContactByIdFromService } = require('../services/contacts');

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

const getContactById = async (req, res) => {
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
      res.status(404).json({
        message: 'Contact not found',
      });
    }
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      message: 'Error fetching contact',
    });
  }
};

module.exports = { getContacts, getContactById };


