import { Job } from 'bull';
import { sendEmail } from '../reminder/utils';

export interface ReminderEmailData {
  email: string;
  text: string;
}

export const FROM_EMAIL = '"Tom 👻" <tom@fair.xyz>';
export const REMINDER_EMAIL_SUBJECT = 'NFT Launch Reminder';

export const sendReminderEmailProcess = async ({
  data: { email, text },
}: Job<ReminderEmailData>) => {
  console.log('sending email', email, text);
  return sendEmail({
    from: FROM_EMAIL,
    to: email,
    subject: REMINDER_EMAIL_SUBJECT,
    text,
    html: `<b>${text}</b>`,
  });
};
