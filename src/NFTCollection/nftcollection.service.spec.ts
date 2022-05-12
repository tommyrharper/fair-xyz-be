import { emailQueue } from './../queues/email.queue';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { Job } from 'bull';
import {
  COLLECTION_NAME,
  HALF_HOUR_IN_MILLISECONDS,
  ONE_DAY_IN_MILLISECONDS,
  ONE_HOUR_IN_MILLISECONDS,
  QUARTER_OF_A_SECOND,
  TEST_EMAIL,
} from '../testing';
import {
  createAndGetTestingModule,
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

  it('updateNFTCollection endpoint updates collection', async () => {
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

  // it('updateNFTCollection updates reminders', async () => {
  //   const collection = await getCollectionByName(em, COLLECTION_NAME);
  // });
});
