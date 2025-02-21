import mongoose, { Document, Schema } from 'mongoose';
import { IPermission } from './permission.model';

export interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[] | IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create indexes
roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;
