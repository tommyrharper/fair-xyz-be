import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NFTCollectionService } from './nftcollection.service';
import { NFTCollectionType } from './nftcollection.type';

@Resolver()
export class NFTCollectionResolver {
  constructor(private reminderService: NFTCollectionService) {}

  // Queries
  @Query(() => String)
  getStuff() {
    return 'This is working';
  }

  // Mutations
  @Mutation(() => NFTCollectionType)
  updateNFTCollection(
    @Args('uuid') uuid: string,
    @Args({ name: 'name', nullable: true }) name: string,
    @Args({ name: 'launchDate', nullable: true }) launchDate: Date | null,
  ) {
    return this.reminderService.updateNFTCollection(uuid, name, launchDate);
  }
}
