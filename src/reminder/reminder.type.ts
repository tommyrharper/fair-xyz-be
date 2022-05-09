import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NFTCollectionType } from 'src/NFTCollection/nftcollection.type';

@ObjectType()
export class ReminderType {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  email: string;

  @Field()
  collection: NFTCollectionType;
}
