import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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

  @Property()
  collection!: number;
}
