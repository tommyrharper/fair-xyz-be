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

  async createNFTCollection(name, launchDate): Promise<NFTCollection> {
    const nftCollection = this.nftCollectionsRepository.create({
      id: 'test',
      name,
      launchDate,
    });

    this.nftCollectionsRepository.persistAndFlush(nftCollection);
    return nftCollection;
  }
}
