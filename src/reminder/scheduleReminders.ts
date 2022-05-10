import { addReminderEmailToQueue } from 'src/queues/email.queue';
import { getEmailStrings, getReminderDelays } from './utils';

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
  const reminderDelays = getReminderDelays(launchDate);

  reminderDelays.forEach((delay, i) => {
    const text = emailStrings[i];
    const jobId = `${collectionId}-${email}-${i}`;
    const emailData = { email, text };

    addReminderEmailToQueue({
      emailData,
      delay,
      jobId,
    });
  });
};
