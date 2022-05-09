import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';

@Entity()
export class Reminder {
  @PrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  email!: string;

  @ManyToOne()
  collection!: NFTCollection;
}
