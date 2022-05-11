import { MikroOrmModule, MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { NFTCollection } from '../NFTCollection/nftcollection.entity';
import { AppService } from '../app.service';
import { NFTCollectionModule } from '../NFTCollection/nftcollection.module';
import { Reminder } from './reminder.entity';
import { ReminderModule } from './reminder.module';
import { ReminderService } from './reminder.service';
import { ReminderResolver } from './reminder.resolver';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as path from 'path';
import {
  Connection,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { GRAPHQL_CONFIG } from '../app.module';

const INITIAL_MIGRATION = 'Migration20220509215402';

const TEST_DB_CONFIG: MikroOrmModuleSyncOptions = {
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

describe('ReminderService', () => {
  let service: ReminderService;
  let migrator: IMigrator;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot(GRAPHQL_CONFIG),
        MikroOrmModule.forRoot(TEST_DB_CONFIG),
        MikroOrmModule.forFeature([Reminder, NFTCollection]),
        ReminderModule,
        NFTCollectionModule,
      ],
      providers: [AppService, ReminderService, ReminderResolver],
    }).compile();

    orm = await MikroORM.init(TEST_DB_CONFIG);

    migrator = orm.getMigrator();
    await migrator.up();
    service = module.get<ReminderService>(ReminderService);
  });

  afterEach(async () => {
    await migrator.down({ to: INITIAL_MIGRATION });
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create a reminder', async () => {
  //   const reminder = await service.createReminder(
  //     'test@gmail.com',
  //     '6c4f4eb0-7bdd-4461-b845-d4d9ca9e7201',
  //   );
  //   expect(reminder).toBeDefined();
  // });
});
