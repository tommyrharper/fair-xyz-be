import { CronJob } from 'cron';
import {
  getEmailStrings,
  getReminderTimes,
  scheduleJob,
  sendReminderEmail,
} from './utils';

export const scheduleReminders = (
  launchDate: Date,
  collectionName: string,
  email: string,
) => {
  const emailStrings = getEmailStrings(collectionName);
  const reminderTimes = getReminderTimes(launchDate);
  const jobs: CronJob[] = [];

  reminderTimes.forEach((reminderTime, i) => {
    const emailString = emailStrings[i];
    const sendEmail = () => sendReminderEmail(email, emailString);
    const job = scheduleJob(reminderTime, sendEmail);
    jobs.push(job);
  });

  return jobs;
};
