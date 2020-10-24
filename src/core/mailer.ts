import nodemailer from 'nodemailer';

const options = {
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 2525,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
};

const transport = nodemailer.createTransport(options);

export default transport;
