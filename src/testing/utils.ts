import {
  EntityManager,
  IDatabaseDriver,
  Connection,
  MikroORM,
  IMigrator,
} from '@mikro-orm/core';
import { Test } from '@nestjs/testing';
import { Job } from 'bull';
import { Reminder } from '../reminder/reminder.entity';
import {
  HALF_HOUR_IN_MILLISECONDS,
  INITIAL_MIGRATION,
  ONE_DAY_IN_MILLISECONDS,
  ONE_HOUR_IN_MILLISECONDS,
  QUARTER_OF_A_SECOND,
  TESTING_MODULE_CONFIG,
  TEST_DB_CONFIG,
  TEST_EMAIL,
  TEST_EMAIL_TWO,
} from '.';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';

export const createTwoRemindersForCollection = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  collection: NFTCollection,
) => {
  const reminder1 = new Reminder();
  reminder1.email = TEST_EMAIL;
  reminder1.collection = collection;

  const reminder2 = new Reminder();
  reminder2.email = TEST_EMAIL_TWO;
  reminder2.collection = collection;

  await em.persistAndFlush([reminder1, reminder2]);

  return [reminder1, reminder2];
};

// TODO: Refactor to use getEmailContentFunction ???

interface CheckJobsHaveBeenProperlyScheduledArgs {
  jobs: Job[];
  email: string;
  collection: NFTCollection;
  reminderCreatedTime: Date;
}

export const checkJobsHaveBeenProperlyScheduled = ({
  jobs,
  email,
  collection,
  reminderCreatedTime,
}: CheckJobsHaveBeenProperlyScheduledArgs) => {
  const { name, launchDate, uuid } = collection;

  expect(jobs.length).toBe(4);

  const launchTime = new Date(launchDate).getTime();
  const expectedDelayLength = [
    launchTime - reminderCreatedTime.getTime() - ONE_DAY_IN_MILLISECONDS,
    launchTime - reminderCreatedTime.getTime() - ONE_HOUR_IN_MILLISECONDS,
    launchTime - reminderCreatedTime.getTime() - HALF_HOUR_IN_MILLISECONDS,
    launchTime - reminderCreatedTime.getTime() - 0,
  ];

  const expectedEmailContent = [
    `REMINDER - THE COLLECTION ${name.toUpperCase()} LAUNCHES IN 1 DAY`,
    `REMINDER - THE COLLECTION ${name.toUpperCase()} LAUNCHES IN 1 HOUR`,
    `REMINDER - THE COLLECTION ${name.toUpperCase()} LAUNCHES IN 30 MINS`,
    `${name.toUpperCase()} IS LAUNCHING NOW!`,
  ];

  jobs.forEach((job, i) => {
    expect(job.id).toBe(`${uuid}-${email}-${i}`);
    expect(job.data.email).toBe(email);
    expect(job.data.text).toBe(expectedEmailContent[i]);

    const timingError = Math.abs(expectedDelayLength[i] - job.opts.delay);

    // This tests that each email with be sent within 250ms of the expected time frame
    expect(timingError).toBeLessThan(QUARTER_OF_A_SECOND);

    job.remove();
  });
};

export const getCollectionByName = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  collectionName: string,
) => {
  return await em.findOne(NFTCollection, {
    name: collectionName,
  });
};

export const getCollectionById = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  uuid: string,
) => {
  return await em.findOne(NFTCollection, {
    uuid,
  });
};

export const createAndGetTestingModule = async () => {
  return await Test.createTestingModule(TESTING_MODULE_CONFIG).compile();
};

export const setupTestDB = async () => {
  const testOrm = await MikroORM.init(TEST_DB_CONFIG);
  const testEm = testOrm.em;

  const testMigrator = testOrm.getMigrator();
  await testMigrator.up();

  return {
    testMigrator,
    testOrm,
    testEm,
  };
};

export const shutdownTestDB = async (
  migrator: IMigrator,
  orm: MikroORM<IDatabaseDriver<Connection>>,
) => {
  await migrator.down({ to: INITIAL_MIGRATION });
  await orm.close(true);
};
