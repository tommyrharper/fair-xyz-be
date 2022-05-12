import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Test } from '@nestjs/testing';
import { TESTING_MODULE_CONFIG } from '.';
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
