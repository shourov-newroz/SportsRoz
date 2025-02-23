import mongoose, { Document, Schema } from 'mongoose';

export interface ITournament extends Document {
  sportType: 'Dart' | 'Table Tennis' | 'FIFA';
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  tournamentType: string;
  status: 'Upcoming' | 'In Progress' | 'Ongoing' | 'Pending' | 'Completed' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const tournamentSchema = new Schema(
  {
    sportType: {
      type: String,
      required: true,
      enum: ['Dart', 'Table Tennis', 'FIFA'],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tournamentType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Upcoming', 'In Progress', 'Completed'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes
tournamentSchema.index({ name: 1 }, { unique: true });
tournamentSchema.index({ sportType: 1 });
tournamentSchema.index({ status: 1 });
tournamentSchema.index({ startDate: 1 });
tournamentSchema.index({ endDate: 1 });

const Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema);

export default Tournament;
