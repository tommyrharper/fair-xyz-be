import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { handleUpdatingReminderJobs } from 'src/queues/utils';
import { Reminder } from 'src/reminder/reminder.entity';
import { NFTCollection } from './nftcollection.entity';
import { getShouldUpdateCollection, handleUpdateCollection } from './utils';

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

      handleUpdatingReminderJobs({
        remindersRepository,
        nftCollection,
      });
    }

    return nftCollection;
  }

  async getNFTCollections(): Promise<NFTCollection[]> {
    return this.nftCollectionsRepository.findAll();
  }
}
