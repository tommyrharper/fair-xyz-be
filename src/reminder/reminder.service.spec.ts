import { emailQueue } from './../queues/email.queue';
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
  EntityManager,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { GRAPHQL_CONFIG } from '../app.module';
import { Job } from 'bull';

const TEST_EMAIL = 'example@gmail.com';
const ONE_DAY_IN_MILLISECONDS = 86_400_000;
const ONE_HOUR_IN_MILLISECONDS = 3_600_000;
const HALF_HOUR_IN_MILLISECONDS = 1_800_000;
const QUARTER_OF_A_SECOND = 250;

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
  let em: EntityManager<IDatabaseDriver<Connection>>;

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
    em = orm.em;

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

  it('createReminder should create a reminder', async () => {
    const collectionName = 'Beauty Embodied';

    const collection = await em.findOne(NFTCollection, {
      name: collectionName,
    });

    expect(collection).toBeDefined();

    const reminder = await service.createReminder(TEST_EMAIL, collection.uuid);

    expect(reminder.collection.uuid).toBe(collection.uuid);
    expect(reminder.collection.name).toBe(collectionName);
    expect(reminder.email).toBe(TEST_EMAIL);
  });

  it('correct emails should be added to queue when a reminder is created', async () => {
    const collectionName = 'Beauty Embodied';
    const addBulkSpy = jest.spyOn(emailQueue, 'addBulk');

    const collection = await em.findOne(NFTCollection, {
      name: collectionName,
    });

    const reminderCreatedTime = new Date().getTime();
    await service.createReminder(TEST_EMAIL, collection.uuid);

    expect(addBulkSpy).toHaveBeenCalledTimes(1);
    const jobs: Job[] = await addBulkSpy.mock.results[0].value;
    expect(jobs.length).toBe(4);

    const expectedEmailContent = [
      'REMINDER - THE COLLECTION BEAUTY EMBODIED LAUNCHES IN 1 DAY',
      'REMINDER - THE COLLECTION BEAUTY EMBODIED LAUNCHES IN 1 HOUR',
      'REMINDER - THE COLLECTION BEAUTY EMBODIED LAUNCHES IN 30 MINS',
      'BEAUTY EMBODIED IS LAUNCHING NOW!',
    ];

    const launchTime = new Date(collection.launchDate).getTime();
    const expectedDelayLength = [
      launchTime - reminderCreatedTime - ONE_DAY_IN_MILLISECONDS,
      launchTime - reminderCreatedTime - ONE_HOUR_IN_MILLISECONDS,
      launchTime - reminderCreatedTime - HALF_HOUR_IN_MILLISECONDS,
      launchTime - reminderCreatedTime - 0,
    ];

    jobs.forEach((job, i) => {
      expect(job.id).toBe(`${collection.uuid}-${TEST_EMAIL}-${i}`);
      expect(job.data.email).toBe(TEST_EMAIL);
      expect(job.data.text).toBe(expectedEmailContent[i]);

      const timingError = Math.abs(expectedDelayLength[i] - job.opts.delay);

      // This tests that each email with be sent within 250ms of the expected time frame
      expect(timingError).toBeLessThan(QUARTER_OF_A_SECOND);

      job.remove();
    });
  });
});
