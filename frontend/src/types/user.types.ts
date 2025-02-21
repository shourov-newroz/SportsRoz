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
  gender?: string;
  contactNumber?: string;
  profilePicture?: string;
}
