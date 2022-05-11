import { EntityRepository, Loaded } from '@mikro-orm/core';
import { NFTCollection } from 'src/NFTCollection/nftcollection.entity';

interface GetShouldUpdateLaunchDateArgs {
  oldLaunchDate: Date | null;
  newLaunchDate?: Date | null;
}

export const getShouldUpdateLaunchDate = ({
  oldLaunchDate,
  newLaunchDate,
}: GetShouldUpdateLaunchDateArgs) => {
  const oldLaunchDateString = oldLaunchDate ? oldLaunchDate.toDateString() : '';

  const launchDateCleared = newLaunchDate === null && oldLaunchDate !== null;
  const launchDateUpdated =
    newLaunchDate && newLaunchDate.toDateString() !== oldLaunchDateString;

  return launchDateCleared || launchDateUpdated;
};

interface GetShouldUpdateNameArgs {
  oldName: string;
  newName?: string;
}

export const getShouldUpdateName = ({
  oldName,
  newName,
}: GetShouldUpdateNameArgs) => newName && newName !== oldName;

interface HandleUpdateCollectionArgs {
  nftCollection: Loaded<NFTCollection, never>;
  nftCollectionsRepository: EntityRepository<NFTCollection>;
  newName?: string;
  newLaunchDate?: Date | null;
}

interface ShouldRemindersBeUpdatedArgs {
  oldName: string;
  oldLaunchDate: Date | null;
  newName?: string;
  newLaunchDate?: Date | null;
}

export const getShouldUpdateCollection = ({
  oldName,
  oldLaunchDate,
  newName,
  newLaunchDate,
}: ShouldRemindersBeUpdatedArgs) => {
  const launchDateUpdated = getShouldUpdateLaunchDate({
    oldLaunchDate,
    newLaunchDate,
  });
  const nameUpdated = getShouldUpdateName({
    oldName,
    newName,
  });

  return launchDateUpdated || nameUpdated;
};

export const handleUpdateCollection = async ({
  nftCollection,
  nftCollectionsRepository,
  newName,
  newLaunchDate,
}: HandleUpdateCollectionArgs) => {
  const shouldUpdateLaunchDate = getShouldUpdateLaunchDate({
    oldLaunchDate: nftCollection.launchDate,
    newLaunchDate,
  });
  const shouldUpdateName = getShouldUpdateName({
    oldName: nftCollection.name,
    newName,
  });

  if (shouldUpdateName) nftCollection.name = newName;
  if (shouldUpdateLaunchDate) nftCollection.launchDate = newLaunchDate;

  return await nftCollectionsRepository.persistAndFlush(nftCollection);
};
