import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NFTCollectionType {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  name: string;

  @Field({ nullable: true })
  launchDate?: Date | null;
}
