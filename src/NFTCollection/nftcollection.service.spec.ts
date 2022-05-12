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
  HALF_HOUR_IN_MILLISECONDS,
  ONE_DAY_IN_MILLISECONDS,
  ONE_HOUR_IN_MILLISECONDS,
  QUARTER_OF_A_SECOND,
  TEST_EMAIL,
} from '../testing';
import {
  createAndGetTestingModule,
  getCollection,
  setupTestDB,
  shutdownTestDB,
} from '../testing/utils';
import { NFTCollectionService } from './nftcollection.service';

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
});
