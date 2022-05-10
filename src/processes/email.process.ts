import { Job } from 'bull';

export const emailProcess = async (job: Job, done) => {
  console.log('inside email Process');
  console.log('job.data', job.data);
  done();
};
