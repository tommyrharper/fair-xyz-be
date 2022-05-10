import { addReminderEmailToQueue } from 'src/queues/email.queue';
import { getDelay, getEmailStrings, getReminderTimes } from './utils';

// TODO: Add correct jobid, remove cron

interface ScheduleRemindersArgs {
  launchDate: Date;
  collectionName: string;
  email: string;
  collectionId: string;
}

export const scheduleReminders = ({
  launchDate,
  collectionName,
  collectionId,
  email,
}: ScheduleRemindersArgs) => {
  const emailStrings = getEmailStrings(collectionName);
  const reminderTimes = getReminderTimes(launchDate);

  reminderTimes.forEach((reminderTime, i) => {
    const emailString = emailStrings[i];
    const delay = getDelay(reminderTime);
    const jobId = `${collectionId}-${email}-${i}`;
    addReminderEmailToQueue({
      data: { email, text: emailString },
      delay,
      jobId,
    });
  });
};
