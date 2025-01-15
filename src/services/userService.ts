import { StandardApiResponse } from '@/types/response';
import { UserWithSubscription } from '@/types/user';

const userService = {
  async getUser(): Promise<StandardApiResponse<UserWithSubscription, 'user'>> {
    const response = await fetch('/api/user');
    const responseData = await response.json();

    return responseData.data;
  },
};

export default userService;
