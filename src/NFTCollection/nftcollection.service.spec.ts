import { emailQueue } from './../queues/email.queue';
import { TestingModule } from '@nestjs/testing';
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { Job } from 'bull';
import { COLLECTION_NAME, TEST_EMAIL, TEST_EMAIL_TWO } from '../testing';
import {
  checkJobsHaveBeenProperlyScheduled,
  checkOldEmailJobsWereCancelled,
  createAndGetTestingModule,
  createTwoRemindersForCollection,
  getCollectionById,
  getCollectionByName,
  setupTestDB,
  shutdownTestDB,
} from '../testing/utils';
import { NFTCollectionService } from './nftcollection.service';
import { addDays } from 'date-fns';
import { Reminder } from '../reminder/reminder.entity';
// import waitForExpect from 'wait-for-expect';
// await waitForExpect(() => {
// });

const NEW_COLLECTION_NAME = 'New name';

describe('NFTCollectionService', () => {
  let service: NFTCollectionService;
  let migrator: IMigrator;
  let orm: MikroORM<IDatabaseDriver<Connection>>;
  let em: EntityManager<IDatabaseDriver<Connection>>;

  beforeEach(async () => {
    const module: TestingModule = await createAndGetTestingModule();
    service = module.get<NFTCollectionService>(NFTCollectionService);

    const { testMigrator, testOrm, testEm } = await setupTestDB();
    migrator = testMigrator;
    orm = testOrm;
    em = testEm;
  });

  afterEach(async () => {
    await shutdownTestDB(migrator, orm);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getNFTCollections returns all collections', async () => {
    const nftCollections = await service.getNFTCollections();

    expect(nftCollections.length).toBe(6);

    nftCollections.forEach((collection) => {
      const { name, launchDate, uuid, createdAt, updatedAt } = collection;
      expect(uuid).toBeTruthy();
      expect(name).toBeTruthy();
      expect(createdAt).toBeTruthy();
      expect(updatedAt).toBeTruthy();
      if (launchDate !== null) {
        expect(launchDate).toBeTruthy();
      }
    });
  });

  describe('updateNFTCollection', () => {
    it('endpoint updates collection', async () => {
      const collection = await getCollectionByName(em, COLLECTION_NAME);

      const newDate = addDays(new Date(), 10);

      const updatedCollection = await service.updateNFTCollection(
        collection.uuid,
        NEW_COLLECTION_NAME,
        newDate,
      );

      expect(updatedCollection.name).toBe(NEW_COLLECTION_NAME);
      expect(new Date(updatedCollection.launchDate)).toEqual(newDate);

      em.clear();

      const updatedCollectionFromDB = await getCollectionById(
        em,
        collection.uuid,
      );

      expect(updatedCollectionFromDB.name).toBe(NEW_COLLECTION_NAME);
    });

    it('changing collection name updates email reminder jobs', async () => {
      const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
      const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

      const collection = await getCollectionByName(em, COLLECTION_NAME);
      await createTwoRemindersForCollection(em, collection);

      const reminderUpdatedTime = new Date();
      const updatedCollection = await service.updateNFTCollection(
        collection.uuid,
        NEW_COLLECTION_NAME,
        undefined,
        true,
      );

      checkOldEmailJobsWereCancelled(removeEmailJobsSpy, collection.uuid);

      expect(addEmailJobsSpy).toHaveBeenCalledTimes(2);

      const reminder1Jobs: Job[] = await addEmailJobsSpy.mock.results[0].value;
      const reminder2Jobs: Job[] = await addEmailJobsSpy.mock.results[1].value;
      const jobsMatrix = [reminder1Jobs, reminder2Jobs];

      const expectedEmails = [TEST_EMAIL, TEST_EMAIL_TWO];

      jobsMatrix.forEach((jobs, j) => {
        checkJobsHaveBeenProperlyScheduled({
          jobs,
          email: expectedEmails[j],
          collection: updatedCollection,
          reminderCreatedTime: reminderUpdatedTime,
        });
      });
    });

    it('changing launchDate to null cancels email reminders', async () => {
      const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
      const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

      const collection = await getCollectionByName(em, COLLECTION_NAME);
      await createTwoRemindersForCollection(em, collection);

      await service.updateNFTCollection(collection.uuid, undefined, null, true);

      checkOldEmailJobsWereCancelled(removeEmailJobsSpy, collection.uuid);

      expect(addEmailJobsSpy).not.toHaveBeenCalled();
    });

    // TODO: extract add reminders logic -> move into beforeEach??? for describe block

    it('changing launchDate updates email reminder jobs', async () => {
      const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
      const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

      const collection = await getCollectionByName(em, COLLECTION_NAME);
      await createTwoRemindersForCollection(em, collection);

      const reminderUpdatedTime = new Date();
      const newLaunchDate = addDays(reminderUpdatedTime, 15);
      const updatedCollection = await service.updateNFTCollection(
        collection.uuid,
        undefined,
        newLaunchDate,
        true,
      );

      checkOldEmailJobsWereCancelled(removeEmailJobsSpy, collection.uuid);

      expect(addEmailJobsSpy).toHaveBeenCalledTimes(2);

      const reminder1Jobs: Job[] = await addEmailJobsSpy.mock.results[0].value;
      const reminder2Jobs: Job[] = await addEmailJobsSpy.mock.results[1].value;
      const jobsMatrix = [reminder1Jobs, reminder2Jobs];

      const expectedEmails = [TEST_EMAIL, TEST_EMAIL_TWO];

      jobsMatrix.forEach((jobs, j) => {
        checkJobsHaveBeenProperlyScheduled({
          jobs,
          email: expectedEmails[j],
          collection: updatedCollection,
          reminderCreatedTime: reminderUpdatedTime,
        });
      });
    });
  });
});
