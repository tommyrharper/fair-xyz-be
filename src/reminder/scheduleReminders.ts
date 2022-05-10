import { CronJob } from 'cron';
import { addReminderEmailToQueue } from 'src/queues/email.queue';
import { getEmailStrings, getReminderTimes } from './utils';

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
    addReminderEmailToQueue({ email, text: emailString }, reminderTime);
    // const job = scheduleJob(reminderTime, sendEmail);
    // jobs.push(job);
  });

  // return jobs;
};
