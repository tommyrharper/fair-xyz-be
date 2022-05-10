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

export const addReminderEmailToQueue = (
  data: SendReminderEmailArgs,
  reminderTime: Date,
) => {
  console.log('about to add to Queue');
  // emailQueue.add(data, {});
  emailQueue.add(data, {
    delay: 1000,
    // jobId: 'example',
    removeOnComplete: true,
  });

  // emailQueue.obliterate();
};
