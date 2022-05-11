import { emailQueue } from 'src/queues/email.queue';

export const handleUpdatingReminderJobs = () => {};

export const removeJobsForSpecificCollection = (collectionId: string) => {
  emailQueue.removeJobs(`${collectionId}*`);
};
