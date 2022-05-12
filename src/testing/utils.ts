import {
  EntityManager,
  IDatabaseDriver,
  Connection,
  MikroORM,
} from '@mikro-orm/core';
import { Test } from '@nestjs/testing';
import { TESTING_MODULE_CONFIG, TEST_DB_CONFIG } from '.';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';

export const getCollection = async (
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
