import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { NFTCollection } from 'src/NFTCollection/nftcollection.entity';
import { Reminder } from './reminder.entity';
import { scheduleReminders } from './scheduleReminders';

// TODO: uncomment persist and flush and remove fake uuid from response

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: EntityRepository<Reminder>,
    @InjectRepository(NFTCollection)
    private nftCollectionsRepository: EntityRepository<NFTCollection>,
  ) {}

  async createReminder(email, collection): Promise<Reminder> {
    const reminder = this.remindersRepository.create({
      email,
      collection,
    });

    // await this.remindersRepository.persistAndFlush(reminder);

    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid: collection,
    });

    scheduleReminders(
      nftCollection.launchDate,
      nftCollection.name,
      reminder.email,
    );

    return {
      uuid: 'beans',
      ...reminder,
      collection: nftCollection,
    };
  }
}
