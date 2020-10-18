import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
});

export default mailer;
