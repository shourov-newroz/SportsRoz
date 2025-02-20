import { AppError } from '@/middleware/errorHandler';
import User, { IUser } from '@/modules/auth/models/user.model';
import { BaseService } from '@/utils/baseService';

class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error during get user', 500);
    }
  }
}

export const userService = new UserService();
