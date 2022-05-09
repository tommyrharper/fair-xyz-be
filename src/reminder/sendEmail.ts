// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendReminder = async (email: string, launchDate: Date) => {
  let text = '';

  sendEmail({
    from: '"Tom 👻" <tom@fair.xyz>',
    to: email,
    subject: 'Hello ✔',
    text,
    html: `<b>${text}</b>`,
  });
};

interface SendEmailArgs {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async ({ from, to, subject, text, html }: SendEmailArgs) => {
  // Using a test account for the purposes of this exercise
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

sendReminder('tom@gmail.com', new Date()).catch(console.error);
