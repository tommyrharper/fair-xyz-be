import { EntityRepository, Loaded } from '@mikro-orm/core';
import { NFTCollection } from 'src/NFTCollection/nftcollection.entity';
import { addReminderEmailToQueue, emailQueue } from 'src/queues/email.queue';
import { Reminder } from 'src/reminder/reminder.entity';
import { getEmailStrings, getReminderDelays } from 'src/reminder/utils';

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

  reminders.forEach((reminder) => {
    scheduleReminders({
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

  scheduleNewRemindersForCollection({
    remindersRepository,
    nftCollection,
  });
};
