import jwt from 'jsonwebtoken';
import { Document, Types } from 'mongoose';
import validateEnv from '../../../config/env';
import { AppError } from '../../../middleware/errorHandler';
import { BaseService } from '../../../utils/baseService';
import logger from '../../../utils/logger';
import User, { IUser } from '../models/user.model';

const env = validateEnv();

interface TokenResponse {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

interface LoginResponse extends TokenResponse {
  id: string;
  email: string;
  name: string;
  officeId: string;
}

interface SignUpRequest {
  name: string;
  email: string;
  officeId: string;
  password: string;
}
interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  officeId: string;
}

export class AuthService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  private generateTokens(user: IUser): TokenResponse {
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      env.JWT_SECRET,
      {
        expiresIn: parseInt(env.JWT_ACCESS_EXPIRATION),
      },
    );

    const refreshToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION,
    });

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: parseInt(env.JWT_ACCESS_EXPIRATION),
      refreshToken: refreshToken,
      refreshTokenExpiresIn: parseInt(env.JWT_REFRESH_EXPIRATION),
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signUp(request: SignUpRequest): Promise<{
    user: IUser;
    otp: string;
    token: string;
    expiryTime: number;
    intervalTime: number;
  }> {
    try {
      const userData = request;

      // Validate email is not null or empty
      if (!userData.email?.trim()) {
        throw new AppError('Email address is required', 400, {
          email: 'Email address is required',
        });
      }

      // Normalize email
      userData.email = userData.email.trim().toLowerCase();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new AppError('Invalid email format', 400, {
          email: 'Please enter a valid email address',
        });
      }

      // Check for existing user
      let user = await User.findOne({ email: userData.email });

      if (user) {
        if (user.isEmailVerified) {
          throw new AppError('This email is already registered.', 409, {
            email: 'This email is already registered.',
          });
        }

        // Check if OTP is still valid
        if (user.otp && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
          return {
            user,
            otp: user.otp,
            token: jwt.sign({ userId: user._id }, env.JWT_SECRET, {
              expiresIn: '10m',
            }),
            expiryTime: Math.floor((user.otpExpiresAt.getTime() - Date.now()) / 1000),
            intervalTime: 30,
          };
        }

        // Update existing unverified user
        user.name = userData.name.trim();
        user.officeId = userData.officeId;
      } else {
        // Create new user
        user = await User.create({
          email: userData.email,
          password: userData.password,
          name: userData.name.trim(),
          officeId: userData.officeId,
          isEmailVerified: false,
          isApproved: false,
        });
      }

      const otp = '123456';
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      await user.save();

      // Generate temporary token for OTP verification
      const tempToken = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
        expiresIn: '10m',
      });

      logger.info(
        `User ${user.isEmailVerified ? 'updated' : 'created'} successfully with ID: ${user._id}`,
      );
      return {
        user,
        otp,
        token: tempToken,
        expiryTime: 600, // 10 minutes in seconds
        intervalTime: 30, // Resend OTP interval in seconds
      };
    } catch (error: any) {
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        throw new AppError('This email is already registered.', 409, {
          email: 'This email is already registered.',
        });
      }
      // Handle validation errors
      if (error.name === 'ValidationError') {
        throw new AppError('Invalid input data', 400, error.errors);
      }
      // Handle other errors
      throw new AppError(error instanceof Error ? error.message : 'Internal server error', 500);
    }
  }

  async verifyOTP(token: string, otp: string): Promise<{ message: string }> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      const user = await this.findById(decoded.userId);

      if (!user) {
        throw new AppError('Invalid token', 401);
      }

      if (!user.otp || !user.otpExpiresAt) {
        throw new AppError('OTP has expired. Please request a new one', 400);
      }

      if (user.otpExpiresAt < new Date()) {
        throw new AppError('OTP has expired. Please request a new one', 400);
      }

      if (user.otp !== otp) {
        throw new AppError('Invalid OTP', 400);
      }

      // Generate temporary password
      user.isEmailVerified = true;
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      return {
        message: 'OTP verified successfully.',
      };
    } catch (error) {
      logger.error('Error verifying OTP:', { error, token });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      throw error;
    }
  }

  async resendOTP(email: string): Promise<string> {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new AppError('User not found', 404, {
        email: 'No account found with this email address',
      });
    }

    const otp = '123456';
    // const otp = this.generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return otp;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const user = await this.findOne({
      refreshToken,
      refreshTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired refresh token', 401, {
        refreshToken: 'Your session has expired. Please sign in again',
      });
    }

    const tokens = this.generateTokens(user);
    await user.save();

    return tokens;
  }

  async resetPassword(email: string, tempPassword: string, newPassword: string): Promise<void> {
    const user = await this.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404, {
        email: 'No account found with this email address',
      });
    }

    // Verify the temporary password
    if (!user.comparePassword) {
      throw new AppError('Password comparison not available', 500);
    }
    const isPasswordValid = await user.comparePassword(tempPassword);
    if (!isPasswordValid) {
      throw new AppError('Invalid temporary password', 401, {
        tempPassword: 'The temporary password you entered is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();
  }

  async createUser(data: CreateUserData): Promise<IUser> {
    try {
      // Check for existing user
      const existingUser = await this.findOne({ email: data.email });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Create new user
      const user = await this.create(data);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error creating user', 500);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new AppError('Invalid credentials', 401, {
        email: 'Invalid email or password',
        password: 'Invalid email or password',
      });
    }

    // Check if email is verified
    // if (!user.isEmailVerified) {
    //   throw new AppError('Please verify your email first', 403, {
    //     email: 'Please verify your email first',
    //   });
    // }

    // Check if account is approved
    // if (!user.isApproved) {
    //   throw new AppError('Your account is pending approval', 403, {
    //     email: 'Your account is pending approval',
    //   });
    // }

    // Compare password using bcrypt directly
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, {
        password: 'Invalid email or password',
        email: 'Invalid email or password',
      });
    }

    // Generate tokens
    return {
      ...this.generateTokens(user),
      id: (user._id as unknown as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
      officeId: user.officeId,
    };
  }

  async register(data: RegisterData): Promise<Omit<IUser & Document, 'password'>> {
    const { email, password, name, officeId } = data;

    // Check if user already exists
    const existingUser = await this.model.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await this.model.create({
      email,
      password,
      name,
      officeId,
      isApproved: false,
      isEmailVerified: false,
    });

    // Return user data (excluding password)
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = userObject;
    return userData as Omit<IUser & Document, 'password'>;
  }
}

export default new AuthService();
