import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NFTCollection } from '../nftCollection/nftCollection.entity';
import { Reminder } from './reminder.entity';
import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';

@Module({
  imports: [MikroOrmModule.forFeature([Reminder, NFTCollection])],
  providers: [ReminderService, ReminderResolver],
})
export class ReminderModule {}
