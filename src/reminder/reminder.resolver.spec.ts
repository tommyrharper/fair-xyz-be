import { emailQueue } from '../queues/email.queue';
import { TestingModule } from '@nestjs/testing';
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  IMigrator,
  MikroORM,
} from '@mikro-orm/core';
import { Job } from 'bull';
import { COLLECTION_NAME, TEST_EMAIL } from '../testing';
import {
  checkJobsHaveBeenProperlyScheduled,
  createAndGetTestingModule,
  getCollectionByName,
  setupTestDB,
  shutdownTestDB,
} from '../testing/utils';
import { ReminderResolver } from './reminder.resolver';

describe('ReminderResolver', () => {
  let appController: ReminderResolver;
  let migrator: IMigrator;
  let orm: MikroORM<IDatabaseDriver<Connection>>;
  let em: EntityManager<IDatabaseDriver<Connection>>;

  beforeEach(async () => {
    const module: TestingModule = await createAndGetTestingModule();
    appController = module.get<ReminderResolver>(ReminderResolver);

    const { testMigrator, testOrm, testEm } = await setupTestDB();
    migrator = testMigrator;
    orm = testOrm;
    em = testEm;
  });

  afterEach(async () => {
    await shutdownTestDB(migrator, orm);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('createReminder should create a reminder', async () => {
    const collection = await getCollectionByName(em, COLLECTION_NAME);

    expect(collection).toBeDefined();

    const reminder = await appController.createReminder(
      TEST_EMAIL,
      collection.uuid,
    );

    expect(reminder.collection.uuid).toBe(collection.uuid);
    expect(reminder.collection.name).toBe(COLLECTION_NAME);
    expect(reminder.email).toBe(TEST_EMAIL);
  });

  it('correct emails should be added to queue when a reminder is created', async () => {
    const addEmailsJobsSpy = jest.spyOn(emailQueue, 'addBulk');

    const collection = await getCollectionByName(em, COLLECTION_NAME);
    const reminderCreatedTime = new Date();

    await appController.createReminder(TEST_EMAIL, collection.uuid);
    expect(addEmailsJobsSpy).toHaveBeenCalledTimes(1);

    const jobs: Job[] = await addEmailsJobsSpy.mock.results[0].value;

    checkJobsHaveBeenProperlyScheduled({
      jobs,
      email: TEST_EMAIL,
      collection,
      reminderCreatedTime,
    });
  });
});
