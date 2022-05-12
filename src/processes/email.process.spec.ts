import * as nodemailer from 'nodemailer';

import { Job } from 'bull';
import { TEST_EMAIL } from '../testing';
import {
  FROM_EMAIL,
  ReminderEmailData,
  REMINDER_EMAIL_SUBJECT,
  sendReminderEmailProcess,
} from './email.process';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const FAKE_JOB = {
  data: { email: TEST_EMAIL, text: 'FAIR MAGIC' },
} as Job<ReminderEmailData>;

describe('sendReminderEmailProcess', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns correct information to and from information from nodemailer', async () => {
    const emailInfo = await sendReminderEmailProcess(FAKE_JOB);

    expect(emailInfo.envelope.from).toBe('tom@fair.xyz');
    expect(emailInfo.envelope.to[0]).toBe(TEST_EMAIL);
  });

  test('sends correct information via nodemailer', async () => {
    const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');

    const sendMailMock = jest.fn(() => ({
      info: 'mock-message-id ',
    }));

    const mockTransporter = {
      sendMail: sendMailMock,
    } as unknown as nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    createTransportSpy.mockReturnValue(mockTransporter);

    await sendReminderEmailProcess(FAKE_JOB);

    expect(createTransportSpy).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: FROM_EMAIL,
      to: TEST_EMAIL,
      subject: REMINDER_EMAIL_SUBJECT,
      text: 'FAIR MAGIC',
      html: `<b>FAIR MAGIC</b>`,
    });
  });
});
