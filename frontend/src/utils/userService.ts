import api from '@/config/apiConfig';
import { IAuthUser } from '@/types/auth.types';

class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getProfile(userId: string): Promise<IAuthUser> {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  }
}

export const userService = UserService.getInstance();
