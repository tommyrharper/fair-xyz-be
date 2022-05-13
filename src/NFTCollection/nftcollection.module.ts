import { Reminder } from '../reminder/reminder.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NFTCollection } from './nftCollection.entity';
import { NFTCollectionResolver } from './nftCollection.resolver';
import { NFTCollectionService } from './nftCollection.service';

@Module({
  imports: [MikroOrmModule.forFeature([NFTCollection, Reminder])],
  providers: [NFTCollectionService, NFTCollectionResolver],
})
export class NFTCollectionModule {}
