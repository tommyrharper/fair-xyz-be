import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NFTCollectionType } from '../nftCollection/nftCollection.type';

@ObjectType()
export class ReminderType {
  @Field(() => ID)
  uuid: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  email: string;

  @Field()
  collection: NFTCollectionType;
}
