import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes
permissionSchema.index({ name: 1 }, { unique: true });

const Permission = mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;
