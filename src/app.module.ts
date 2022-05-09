import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderModule } from './reminder/reminder.module';
import { NFTCollectionModule } from './NFTCollection/nftcollection.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    MikroOrmModule.forRoot(),
    ReminderModule,
    NFTCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
