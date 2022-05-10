/* eslint-disable @typescript-eslint/no-var-requires */
// import Bull from 'bull';
const Bull = require('bull');
import { emailProcess } from 'src/processes/email.process';

const redisURI = 'redis://127.0.0.1';

const emailQueue = new Bull('email', redisURI);

emailQueue.process(emailProcess);

export const sendNewEmail = (data) => {
  console.log('about to add to Queue');
  // emailQueue.add(data, {});
  emailQueue.add(data, {
    delay: 1000,
    jobId: 'example',
    removeOnComplete: true,
  });

  // emailQueue.obliterate();
};
