import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Reminder } from '../reminder/reminder.entity';

@Entity()
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

  // @OneToMany(() => Reminder, (reminder) => reminder.email)
  // reminders = new Collection<Reminder>(this);
}
