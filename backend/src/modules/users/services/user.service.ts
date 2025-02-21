import { AppError } from '../../../middleware/errorHandler';
import { BaseService } from '../../../utils/baseService';
import User, { IUser } from '../../auth/models/user.model';

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

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.model.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export default new UserService();
