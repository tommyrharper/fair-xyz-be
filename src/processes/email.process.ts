import { Job } from 'bull';
import { sendEmail } from 'src/reminder/utils';

export interface ReminderEmailData {
  email: string;
  text: string;
}

export const sendReminderEmailProcess = async ({
  data: { email, text },
}: Job<ReminderEmailData>) => {
  console.log('sending email', email, text);
  sendEmail({
    from: '"Tom 👻" <tom@fair.xyz>',
    to: email,
    subject: 'NFT Launch Reminder',
    text,
    html: `<b>${text}</b>`,
  });
};
