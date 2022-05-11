import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { handleUpdatingReminderJobs } from 'src/queues/utils';
import { NFTCollection } from './nftcollection.entity';
import { handleUpdateCollection } from './utils';

@Injectable()
export class NFTCollectionService {
  constructor(
    @InjectRepository(NFTCollection)
    private nftCollectionsRepository: EntityRepository<NFTCollection>,
  ) {}

  async updateNFTCollection(
    uuid: string,
    name?: string,
    launchDate?: Date | null,
  ): Promise<NFTCollection> {
    const { nftCollectionsRepository } = this;
    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid,
    });

    await handleUpdateCollection({
      nftCollection,
      nftCollectionsRepository,
      name,
      launchDate,
    });

    handleUpdatingReminderJobs();

    return nftCollection;
  }

  async getNFTCollections(): Promise<NFTCollection[]> {
    return this.nftCollectionsRepository.findAll();
  }
}
