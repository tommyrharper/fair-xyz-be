import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { handleUpdatingReminderJobs } from '../queues/utils';
import { Reminder } from '../reminder/reminder.entity';
import { NFTCollection } from './nftcollection.entity';
import { getShouldUpdateCollection, handleUpdateCollection } from './utils';

// TODO: see if waitForJobsToFinish can be removed

@Injectable()
export class NFTCollectionService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: EntityRepository<Reminder>,
    @InjectRepository(NFTCollection)
    private nftCollectionsRepository: EntityRepository<NFTCollection>,
  ) {}

  async updateNFTCollection(
    uuid: string,
    newName?: string,
    newLaunchDate?: Date | null,
    waitForJobsToFinish = false,
  ): Promise<NFTCollection> {
    const { nftCollectionsRepository, remindersRepository } = this;
    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid,
    });

    const shouldUpdateCollection = getShouldUpdateCollection({
      oldName: nftCollection.name,
      oldLaunchDate: nftCollection.launchDate,
      newName,
      newLaunchDate,
    });

    if (shouldUpdateCollection) {
      await handleUpdateCollection({
        nftCollection,
        nftCollectionsRepository,
        newName,
        newLaunchDate,
      });

      const jobs = handleUpdatingReminderJobs({
        remindersRepository,
        nftCollection,
      });

      if (waitForJobsToFinish) {
        await Promise.all(await jobs);
      }
    }

    return nftCollection;
  }

  async getNFTCollections(): Promise<NFTCollection[]> {
    return this.nftCollectionsRepository.findAll();
  }
}
