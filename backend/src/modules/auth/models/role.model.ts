import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
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
  },
  {
    timestamps: true,
  },
);

// Create indexes
roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;
