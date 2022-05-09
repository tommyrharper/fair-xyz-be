import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { NFTCollection } from './nftcollection.entity';
import { NFTCollectionResolver } from './nftcollection.resolver';
import { NFTCollectionService } from './nftcollection.service';

@Module({
  imports: [MikroOrmModule.forFeature([NFTCollection])],
  providers: [NFTCollectionService, NFTCollectionResolver],
})
export class NFTCollectionModule {}
