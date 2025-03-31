const nodemailer = require("nodemailer");
const { getEnvVar } = require("../utils/getEnvVar");
const { SMTP } = require('../constants/index.js');

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

module.exports = sendEmail;