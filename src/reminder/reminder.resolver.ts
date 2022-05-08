import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReminderService } from './reminder.service';
import { ReminderType } from './reminder.type';

@Resolver()
export class ReminderResolver {
  constructor(private reminderService: ReminderService) {}

  // Queries
  @Query(() => String)
  getStuff() {
    return 'This is working';
  }

  // Mutations
  @Mutation(() => ReminderType)
  createReminder(
    @Args('email') email: string,
    @Args('collection') collection: number,
  ) {
    return this.reminderService.createReminder(email, collection);
  }
}
