import * as nodemailer from 'nodemailer';

import {
  addMinutes,
  addHours,
  addDays,
  differenceInMilliseconds,
} from 'date-fns';

const NODE_MAILER_HOST = 'smtp.ethereal.email';
const NODE_MAILER_PORT = 587;

export const getReminderDelays = (launchDate: Date) => {
  const reminderTimes = getReminderTimes(launchDate);
  return reminderTimes.map(getDelay);
};

export const getDelay = (date: Date) => {
  return differenceInMilliseconds(date, new Date());
};

export const getReminderTimes = (launchDate: Date) => {
  return [
    addDays(launchDate, -1),
    addHours(launchDate, -1),
    addMinutes(launchDate, -30),
    launchDate,
  ];
};

export const getEmailStrings = (collectionName: string) => {
  const upperCaseName = collectionName.toUpperCase();
  return [
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN 1 DAY`,
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN 1 HOUR`,
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN 30 MINS`,
    `${upperCaseName} IS LAUNCHING NOW!`,
  ];
};

interface SendEmailArgs {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async ({
  from,
  to,
  subject,
  text,
  html,
}: SendEmailArgs) => {
  // Using a test account for the purposes of this exercise
  // One thing to note if testing this testing service frequently goes down
  // For the current status see: https://www.saashub.com/ethereal-email-status
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: NODE_MAILER_HOST,
    port: NODE_MAILER_PORT,
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

  return info;
};
