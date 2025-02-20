const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const contactsRouter = require('./routers/contacts');
const { errorHandler } = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');
const authRouter = require("./routers/auth");
const cookieParser = require('cookie-parser');

const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/auth", authRouter);

  app.use('/contacts', contactsRouter);


  app.use(notFoundHandler);


  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

module.exports = { setupServer };
