import mongoose, { Document, Schema } from 'mongoose';
import { ITeam } from './team.model';
import { ITournament } from './tournament.model';

export interface IMatch extends Document {
  tournament: mongoose.Types.ObjectId | ITournament;
  team1: mongoose.Types.ObjectId | ITeam;
  team2: mongoose.Types.ObjectId | ITeam;
  team1Score: number;
  team2Score: number;
  matchStatus: 'Upcoming' | 'In Progress' | 'Finished' | 'Postponed' | 'Canceled';
  matchWinner: mongoose.Types.ObjectId | ITeam;
  matchType: string;
  matchDate: Date;
  matchTime: Date;
  venue: string;
  result: any; // Mixed type for flexible, sport-specific results
  createdAt: Date;
  updatedAt: Date;
}

const matchSchema = new Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    team1Score: {
      type: Number,
      default: 0,
    },
    team2Score: {
      type: Number,
      default: 0,
    },
    matchStatus: {
      type: String,
      required: true,
      enum: ['Upcoming', 'In Progress', 'Finished', 'Postponed', 'Canceled'],
      default: 'Upcoming',
    },
    matchWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    matchType: {
      type: String,
      required: true,
      trim: true,
    },
    matchDate: {
      type: Date,
      required: true,
    },
    matchTime: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes
matchSchema.index({ tournament: 1 });
matchSchema.index({ team1: 1 });
matchSchema.index({ team2: 1 });
matchSchema.index({ matchStatus: 1 });
matchSchema.index({ matchDate: 1 });
matchSchema.index({ matchTime: 1 });
matchSchema.index({ venue: 1 });

const Match = mongoose.model<IMatch>('Match', matchSchema);

export default Match;
