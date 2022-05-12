import {
  EntityManager,
  IDatabaseDriver,
  Connection,
  MikroORM,
  IMigrator,
} from '@mikro-orm/core';
import { Test } from '@nestjs/testing';
import { INITIAL_MIGRATION, TESTING_MODULE_CONFIG, TEST_DB_CONFIG } from '.';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';

export const getCollectionByName = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  collectionName: string,
) => {
  return await em.findOne(NFTCollection, {
    name: collectionName,
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
