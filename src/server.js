const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const { getContacts, getContactById } = require('./controllers/contactsController');
const setupServer = () => {
  const app = express();
  const logger = pino();


  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());


  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContactById);


  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
