import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { NFTCollection } from 'src/NFTCollection/nftcollection.entity';
import { Reminder } from './reminder.entity';
import { scheduleReminders } from './scheduleReminders';

interface ReminderJobsMap {
  [collectionUuid: string]: CronJob[];
}

// In production would persist in redis or similar
export const reminderJobs: ReminderJobsMap = {};

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

    await this.remindersRepository.persistAndFlush(reminder);

    const nftCollection = await this.nftCollectionsRepository.findOne({
      uuid: collection,
    });

    const jobs = scheduleReminders(
      nftCollection.launchDate,
      nftCollection.name,
      reminder.email,
    );

    reminderJobs[nftCollection.uuid] = jobs;

    return {
      ...reminder,
      collection: nftCollection,
    };
  }
}
