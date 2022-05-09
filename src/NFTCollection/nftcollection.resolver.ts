import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NFTCollectionService } from './nftcollection.service';
import { NFTCollectionType } from './nftcollection.type';

// @InputType()
// export class UpvotePostInput {
//   @Field()
//   postId: number;
// }

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
  createNFTCollection(
    @Args('name') name: string,
    @Args({ name: 'launchDate', nullable: true }) launchDate: Date | null,
  ) {
    return this.reminderService.createNFTCollection(name, launchDate);
  }
}
