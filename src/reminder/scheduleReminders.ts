import { addReminderEmailToQueue } from 'src/queues/email.queue';
import { getDelay, getEmailStrings, getReminderTimes } from './utils';

// TODO: Add correct jobid

export const scheduleReminders = (
  launchDate: Date,
  collectionName: string,
  email: string,
) => {
  const emailStrings = getEmailStrings(collectionName);
  const reminderTimes = getReminderTimes(launchDate);

  reminderTimes.forEach((reminderTime, i) => {
    const emailString = emailStrings[i];
    const delay = getDelay(reminderTime);
    addReminderEmailToQueue({ email, text: emailString }, delay);
  });
};
