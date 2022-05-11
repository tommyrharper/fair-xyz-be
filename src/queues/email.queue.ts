import * as Bull from 'bull';
import { JobOptions } from 'bull';

import {
  sendReminderEmailProcess,
  ReminderEmailData,
} from 'src/processes/email.process';

const redisURI = 'redis://127.0.0.1';

export const emailQueue = new Bull('email', redisURI);

emailQueue.process(sendReminderEmailProcess);

export type EmailReminderJob = {
  name?: string | undefined;
  data: ReminderEmailData;
  opts?: Omit<JobOptions, 'repeat'>;
};

export const addEmailReminderJobsToQueue = (
  emailJobs: Array<EmailReminderJob>,
) => {
  return emailQueue.addBulk(emailJobs);
};
