import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['name'] })
export class NFTCollection {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  uuid: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  name!: string;

  @Property({ nullable: true })
  launchDate: Date | null;
}
