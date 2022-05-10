import {
  getEmailStrings,
  getReminderTimes,
  scheduleJob,
  sendReminderEmail,
} from './utils';

const scheduleReminders = (
  launchDate: Date,
  collectionName: string,
  email: string,
) => {
  const emailStrings = getEmailStrings(collectionName);
  const reminderTimes = getReminderTimes(launchDate);
  const job1 = scheduleJob(reminderTimes[0], () => {
    sendReminderEmail(email, emailStrings[0]);
  });
  const job2 = scheduleJob(reminderTimes[1], () => {
    sendReminderEmail(email, emailStrings[1]);
  });
  const job3 = scheduleJob(reminderTimes[2], () => {
    sendReminderEmail(email, emailStrings[2]);
  });
  const job4 = scheduleJob(reminderTimes[3], () => {
    sendReminderEmail(email, emailStrings[3]);
  });
  return [job1, job2, job3, job4];
};
