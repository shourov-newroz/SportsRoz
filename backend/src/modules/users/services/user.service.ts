import { AppError } from '../../../middleware/errorHandler';
import { BaseService } from '../../../utils/baseService';
import User, { IUser } from '../../auth/models/user.model';

interface UpdateProfileData {
  name?: string;
  jerseyName?: string;
  sportType?: string[];
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  contactNumber?: string;
  profilePicture?: string;
}

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

  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<IUser> {
    try {
      const user = await this.model
        .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
        .select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error updating profile', 500);
    }
  }

  async getAllApproved(): Promise<IUser[]> {
    return this.model.find({ isApproved: true });
  }

  async getAllPending(): Promise<IUser[]> {
    return this.model.find({ isApproved: false });
  }

  async updateStatus(userId: string, isApproved: boolean): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, { isApproved }, { new: true });
  }

  async updateRole(userId: string, role: string): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async getAllUsers(isApproved: boolean): Promise<IUser[]> {
    try {
      const users = await this.model.find({ isApproved });
      return users;
    } catch (error) {
      throw new AppError('Error fetching users', 500);
    }
  }
}

export default new UserService();
