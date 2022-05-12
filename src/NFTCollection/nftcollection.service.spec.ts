import { emailQueue } from './../queues/email.queue';
import { TestingModule } from '@nestjs/testing';
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { COLLECTION_NAME } from '../testing';
import {
  checkAllEmailJobsForCollectionHaveBeenProperlyRescheduled,
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

    it('changing launchDate to null cancels email reminders', async () => {
      const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
      const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

      const collection = await getCollectionByName(em, COLLECTION_NAME);
      await createTwoRemindersForCollection(em, collection);

      await service.updateNFTCollection(collection.uuid, undefined, null);

      checkOldEmailJobsWereCancelled(removeEmailJobsSpy, collection.uuid);

      expect(addEmailJobsSpy).not.toHaveBeenCalled();
    });

    describe('correctly updates email reminder jobs', () => {
      it('changing name', async () => {
        const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
        const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

        const collection = await getCollectionByName(em, COLLECTION_NAME);
        await createTwoRemindersForCollection(em, collection);

        const reminderUpdatedTime = new Date();

        const updatedCollection = await service.updateNFTCollection(
          collection.uuid,
          NEW_COLLECTION_NAME,
          undefined,
        );

        await checkAllEmailJobsForCollectionHaveBeenProperlyRescheduled({
          removeEmailJobsSpy,
          addEmailJobsSpy,
          updatedCollection,
          reminderUpdatedTime,
        });
      });

      it('changing launchDate', async () => {
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
        );

        await checkAllEmailJobsForCollectionHaveBeenProperlyRescheduled({
          removeEmailJobsSpy,
          addEmailJobsSpy,
          updatedCollection,
          reminderUpdatedTime,
        });
      });

      it('changing launchDate and name', async () => {
        const addEmailJobsSpy = jest.spyOn(emailQueue, 'addBulk');
        const removeEmailJobsSpy = jest.spyOn(emailQueue, 'removeJobs');

        const collection = await getCollectionByName(em, COLLECTION_NAME);
        await createTwoRemindersForCollection(em, collection);

        const reminderUpdatedTime = new Date();
        const newLaunchDate = addDays(reminderUpdatedTime, 15);

        const updatedCollection = await service.updateNFTCollection(
          collection.uuid,
          NEW_COLLECTION_NAME,
          newLaunchDate,
        );

        await checkAllEmailJobsForCollectionHaveBeenProperlyRescheduled({
          removeEmailJobsSpy,
          addEmailJobsSpy,
          updatedCollection,
          reminderUpdatedTime,
        });
      });
    });
  });
});
