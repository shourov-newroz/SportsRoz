export type Gender = 'Male' | 'Female' | 'Other';

export interface IUser {
  userId: string;
  email: string;
  password: string;
  name: string;
  jerseyName?: string;
  officeId: string;
  sportType?: string[];
  dateOfBirth?: Date;
  role?: string;
  gender?: Gender;
  contactNumber?: string;
  profilePicture?: string;
}
