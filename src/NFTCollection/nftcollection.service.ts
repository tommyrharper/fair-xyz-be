import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NFTCollection } from './nftcollection.entity';

@Injectable()
export class NFTCollectionService {
  constructor(
    @InjectRepository(NFTCollection)
    private nftCollectionsRepository: EntityRepository<NFTCollection>,
  ) {}

  async updateNFTCollection(uuid, name, launchDate): Promise<NFTCollection> {
    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid,
    });

    if (name) nftCollection.name = name;
    nftCollection.launchDate = launchDate;

    await this.nftCollectionsRepository.persistAndFlush(nftCollection);
    return nftCollection;
  }
}
