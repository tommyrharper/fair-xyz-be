import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';

export const getCollection = async (
  em: EntityManager<IDatabaseDriver<Connection>>,
  collectionName: string,
) => {
  return await em.findOne(NFTCollection, {
    name: collectionName,
  });
};
