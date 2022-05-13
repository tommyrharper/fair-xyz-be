import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NFTCollectionService } from './nftCollection.service';
import { NFTCollectionType } from './nftCollection.type';

@Resolver()
export class NFTCollectionResolver {
  constructor(private reminderService: NFTCollectionService) {}

  // Queries
  @Query(() => [NFTCollectionType])
  getNFTCollections() {
    return this.reminderService.getNFTCollections();
  }

  // Mutations
  @Mutation(() => NFTCollectionType)
  updateNFTCollection(
    @Args('uuid') uuid: string,
    @Args({ name: 'name', nullable: true }) name?: string,
    @Args({ name: 'launchDate', nullable: true }) launchDate?: Date | null,
  ) {
    return this.reminderService.updateNFTCollection(uuid, name, launchDate);
  }
}
