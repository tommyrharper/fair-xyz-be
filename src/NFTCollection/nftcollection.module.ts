import { Reminder } from 'src/reminder/reminder.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NFTCollection } from './nftcollection.entity';
import { NFTCollectionResolver } from './nftcollection.resolver';
import { NFTCollectionService } from './nftcollection.service';

@Module({
  imports: [MikroOrmModule.forFeature([NFTCollection, Reminder])],
  providers: [NFTCollectionService, NFTCollectionResolver],
})
export class NFTCollectionModule {}
