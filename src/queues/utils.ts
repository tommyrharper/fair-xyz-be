import { EntityRepository, Loaded } from '@mikro-orm/core';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';
import { ReminderEmailData } from '../processes/email.process';
import {
  addEmailReminderJobsToQueue,
  emailQueue,
  EmailReminderJob,
} from '../queues/email.queue';
import { Reminder } from '../reminder/reminder.entity';
import { getEmailStrings, getReminderDelays } from '../reminder/utils';

const getEmailReminderJobs = ({
  launchDate,
  collectionName,
  collectionId,
  email,
}: ScheduleRemindersArgs): EmailReminderJob[] => {
  const emailStrings = getEmailStrings(collectionName);
  const reminderDelays = getReminderDelays(launchDate);

  return reminderDelays.map((delay, i) => {
    const text = emailStrings[i];
    const jobId = `${collectionId}-${email}-${i}`;
    const data: ReminderEmailData = { email, text };
    return {
      data,
      opts: {
        delay,
        jobId,
        removeOnComplete: true,
      },
    };
  });
};

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
  const reminderJobs = getEmailReminderJobs({
    launchDate,
    collectionName,
    collectionId,
    email,
  });

  return addEmailReminderJobsToQueue(reminderJobs);
};

export const deleteAllJobsForCollection = (collectionId: string) => {
  emailQueue.removeJobs(`${collectionId}*`);
};

const scheduleNewRemindersForCollection = async ({
  remindersRepository,
  nftCollection,
}: HandleUpdatingReminderJobsArgs) => {
  const reminders = await remindersRepository.find({
    collection: nftCollection.uuid,
  });

  return reminders.map((reminder) => {
    return scheduleReminders({
      launchDate: nftCollection.launchDate,
      collectionName: nftCollection.name,
      collectionId: nftCollection.uuid,
      email: reminder.email,
    });
  });
};

interface HandleUpdatingReminderJobsArgs {
  remindersRepository: EntityRepository<Reminder>;
  nftCollection: Loaded<NFTCollection, never>;
}

export const handleUpdatingReminderJobs = async ({
  remindersRepository,
  nftCollection,
}: HandleUpdatingReminderJobsArgs) => {
  deleteAllJobsForCollection(nftCollection.uuid);

  if (nftCollection.launchDate === null) return;

  return scheduleNewRemindersForCollection({
    remindersRepository,
    nftCollection,
  });
};
