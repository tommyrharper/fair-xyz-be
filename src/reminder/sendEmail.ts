import { getEmailStrings, scheduleJob, sendReminderEmail } from './utils';

const scheduleReminders = (launchDate: Date, collectionName: string, email: string) => {
  const emailStrings = getEmailStrings(collectionName);
  const job1 = scheduleJob(reminderTime, () => {
    sendReminderEmail(email, emailStrings[0]);
  });
  const job2 = scheduleJob(reminderTime, () => {
    sendReminderEmail(email, emailStrings[1]);
  });
  const job3 = scheduleJob(reminderTime, () => {
    sendReminderEmail(email, emailStrings[2]);
  });
  const job4 = scheduleJob(reminderTime, () => {
    sendReminderEmail(email, emailStrings[3]);
  });
};

const scheduleReminder = (reminderTime: Date, email: string, text: string) => {
  return scheduleJob(reminderTime, () => {
    sendReminderEmail(email, text);
  });
};

// sendReminder('tom@gmail.com', new Date()).catch(console.error);
