import * as path from 'path';
import { MikroOrmModule, MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { GraphQLModule } from '@nestjs/graphql';
import { GRAPHQL_CONFIG } from '../app.module';
import { AppService } from '../app.service';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';
import { NFTCollectionModule } from '../NFTCollection/nftcollection.module';
import { NFTCollectionResolver } from '../NFTCollection/nftcollection.resolver';
import { NFTCollectionService } from '../NFTCollection/nftcollection.service';
import { Reminder } from '../reminder/reminder.entity';
import { ReminderModule } from '../reminder/reminder.module';
import { ReminderResolver } from '../reminder/reminder.resolver';
import { ReminderService } from '../reminder/reminder.service';
import { ModuleMetadata } from '@nestjs/common';

export const TEST_EMAIL = 'example@gmail.com';
export const ONE_DAY_IN_MILLISECONDS = 86_400_000;
export const ONE_HOUR_IN_MILLISECONDS = 3_600_000;
export const HALF_HOUR_IN_MILLISECONDS = 1_800_000;
export const QUARTER_OF_A_SECOND = 250;

export const INITIAL_MIGRATION = 'Migration20220509215402';

export const TEST_DB_CONFIG: MikroOrmModuleSyncOptions = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  dbName: 'fair-xyz-test',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: path.join(__dirname, '../migrations'),
    glob: '!(*.d).{js,ts}',
  },
};

export const TESTING_MODULE_CONFIG: ModuleMetadata = {
  imports: [
    GraphQLModule.forRoot(GRAPHQL_CONFIG),
    MikroOrmModule.forRoot(TEST_DB_CONFIG),
    MikroOrmModule.forFeature([Reminder, NFTCollection]),
    ReminderModule,
    NFTCollectionModule,
  ],
  providers: [
    AppService,
    ReminderService,
    ReminderResolver,
    NFTCollectionService,
    NFTCollectionResolver,
  ],
};
