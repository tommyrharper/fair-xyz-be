import { EntityRepository, Loaded } from '@mikro-orm/core';
import { NFTCollection } from 'src/NFTCollection/nftcollection.entity';

interface HandleUpdateCollectionArgs {
  nftCollection: Loaded<NFTCollection, never>;
  nftCollectionsRepository: EntityRepository<NFTCollection>;
  name?: string;
  launchDate?: Date | null;
}

export const getShouldUpdateLaunchDate = (launchDate?: Date | null) =>
  launchDate === null || launchDate;

export const handleUpdateCollection = async ({
  nftCollection,
  nftCollectionsRepository,
  name,
  launchDate,
}: HandleUpdateCollectionArgs) => {
  const shouldUpdateLaunchDate = getShouldUpdateLaunchDate(launchDate);
  if (name) nftCollection.name = name;
  if (shouldUpdateLaunchDate) {
    nftCollection.launchDate = launchDate;
  }
  return await nftCollectionsRepository.persistAndFlush(nftCollection);
};
