import nodemailer from "nodemailer";

import {
  NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_SECURE,
  NODEMAILER_SERVICE,
} from "./index.js";

const mailTransporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE,
  port: NODEMAILER_PORT,
  secure: NODEMAILER_SECURE, // true for 465, false for other ports
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});

export default mailTransporter;
