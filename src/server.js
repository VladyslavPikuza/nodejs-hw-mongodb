const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');



const setupServer = () => {
  const app = express();
  const logger = pino();
  app.use(cors());
  app.use(pinoHttp({ logger }));


  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

};



module.exports = { setupServer };
