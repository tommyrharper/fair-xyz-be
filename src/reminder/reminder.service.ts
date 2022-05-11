import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';
import { scheduleReminders } from '../queues/utils';
import { Reminder } from './reminder.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: EntityRepository<Reminder>,
    @InjectRepository(NFTCollection)
    private nftCollectionsRepository: EntityRepository<NFTCollection>,
  ) {}

  async createReminder(email: string, collection: string): Promise<Reminder> {
    const reminder = this.remindersRepository.create({
      email,
      collection,
    });

    await this.remindersRepository.persistAndFlush(reminder);

    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid: collection,
    });

    scheduleReminders({
      launchDate: nftCollection.launchDate,
      collectionName: nftCollection.name,
      email: reminder.email,
      collectionId: nftCollection.uuid,
    });

    return {
      ...reminder,
      collection: nftCollection,
    };
  }
}
