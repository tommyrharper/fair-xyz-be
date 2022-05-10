import { getEmailStrings, getReminderTimes } from './utils';

test('getEmailStrings', () => {
  const collectionName = 'The Magic of Japan';
  const emailStrings = getEmailStrings(collectionName);
  expect(emailStrings[0]).toBe(
    'REMINDER - THE COLLECTION THE MAGIC OF JAPAN LAUNCHES IN 1 DAY',
  );
  expect(emailStrings[1]).toBe(
    'REMINDER - THE COLLECTION THE MAGIC OF JAPAN LAUNCHES IN 1 HOUR',
  );
  expect(emailStrings[2]).toBe(
    'REMINDER - THE COLLECTION THE MAGIC OF JAPAN LAUNCHES IN 30 MINS',
  );
  expect(emailStrings[3]).toBe('THE MAGIC OF JAPAN IS LAUNCHING NOW!');
});

test('getReminderTimes', () => {
  const launchDate = new Date('2020-01-05');

  const reminderTimes = getReminderTimes(launchDate);

  expect(reminderTimes[0]).toEqual(new Date('2020-01-04 00:00:00.000'));
  expect(reminderTimes[1]).toEqual(new Date('2020-01-04 23:00:00.000'));
  expect(reminderTimes[2]).toEqual(new Date('2020-01-04 23:30:00.000'));
  expect(reminderTimes[3]).toEqual(new Date('2020-01-05 00:00:00.000'));
});
