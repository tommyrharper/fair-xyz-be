import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Reminder } from './reminder.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: EntityRepository<Reminder>,
  ) {}

  async createReminder(email, collection): Promise<Reminder> {
    const reminder = this.remindersRepository.create({
      email,
      collection,
    });

    await this.remindersRepository.persistAndFlush(reminder);
    return reminder;
  }
}
