import { Subscription, User } from '@prisma/client';

export type UserWithSubscription = User & {
  subscription: Subscription | undefined | null;
};
