import mailer from '../core/mailer';
import { SentMessageInfo } from 'nodemailer';

interface ISendEmail {
  emailTo: string;
  subject: string;
  html: string;
}

export const sendEmail = (
  { emailTo, subject, html }: ISendEmail,
  callback?: (e: Error, info: SentMessageInfo) => void
) => {
  mailer.sendMail(
    {
      from: 'admin@twitter.com',
      to: emailTo,
      subject,
      html,
    },
    callback ||
      function (err: Error | null, info: SentMessageInfo) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
  );
};
