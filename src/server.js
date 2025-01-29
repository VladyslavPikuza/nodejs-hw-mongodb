const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const contactsRouter = require('./routers/contacts');
const { errorHandler } = require('./middlewares/errorHandler');

const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());


  app.use('/contacts', contactsRouter);


  app.use(errorHandler);

  
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
