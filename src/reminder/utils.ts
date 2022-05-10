/* eslint-disable @typescript-eslint/no-var-requires */
// import nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');
import {
  addMinutes,
  addHours,
  addDays,
  differenceInMilliseconds,
} from 'date-fns';

const NODE_MAILER_HOST = 'smtp.ethereal.email';
const NODE_MAILER_PORT = 587;

// TODO: remove enum

enum TimeToLaunch {
  oneDay = '1 DAY',
  oneHour = '1 HOUR',
  thirtyMins = '30 MINS',
}

export const getDelay = (date: Date) => {
  return differenceInMilliseconds(new Date(), date);
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
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN ${TimeToLaunch.oneDay}`,
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN ${TimeToLaunch.oneHour}`,
    `REMINDER - THE COLLECTION ${upperCaseName} LAUNCHES IN ${TimeToLaunch.thirtyMins}`,
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
};
