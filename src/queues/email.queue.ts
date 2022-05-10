/* eslint-disable @typescript-eslint/no-var-requires */
// import Bull from 'bull';
const Bull = require('bull');
import {
  sendReminderEmailProcess,
  SendReminderEmailArgs,
} from 'src/processes/email.process';

const redisURI = 'redis://127.0.0.1';

export const emailQueue = new Bull('email', redisURI);

emailQueue.process(sendReminderEmailProcess);

interface AddEmailReminderToQueueArgs {
  emailData: SendReminderEmailArgs;
  delay: number;
  jobId: string;
}

// TODO: remove obliterate reminder

export const addReminderEmailToQueue = ({
  emailData,
  delay,
  jobId,
}: AddEmailReminderToQueueArgs) => {
  emailQueue.add(emailData, {
    delay,
    jobId,
    removeOnComplete: true,
  });

  // emailQueue.obliterate();
};
