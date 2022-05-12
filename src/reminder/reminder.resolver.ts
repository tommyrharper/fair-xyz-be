import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReminderService } from './reminder.service';
import { ReminderType } from './reminder.type';

@Resolver()
export class ReminderResolver {
  constructor(private reminderService: ReminderService) {}

  // Mutations
  @Mutation(() => ReminderType)
  createReminder(
    @Args('email') email: string,
    @Args('collection') collection: string,
  ) {
    return this.reminderService.createReminder(email, collection);
  }
}
