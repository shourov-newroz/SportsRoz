import bcrypt from 'bcryptjs';
import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  jerseyName?: string;
  officeId: string;
  sportType?: string[];
  dateOfBirth?: Date;
  role?: Schema.Types.ObjectId;
  gender?: string;
  contactNumber?: string;
  profilePicture?: string;
  isApproved: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  otp?: string;
  otpExpiresAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    jerseyName: { type: String },
    officeId: { type: String, required: true },
    sportType: [{ type: String }],
    dateOfBirth: { type: Date },
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    gender: { type: String },
    contactNumber: { type: String },
    profilePicture: { type: String },
    isApproved: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
