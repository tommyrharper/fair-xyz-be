import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { NFTCollection } from '../nftCollection/nftCollection.entity';

@Entity()
@Unique({ properties: ['email', 'collection'] })
export class Reminder {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  uuid: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  email!: string;

  @ManyToOne()
  collection!: NFTCollection;
}
