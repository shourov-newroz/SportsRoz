import { IPermission } from './permission.types';

export interface IRole {
  id: string;
  name: string;
  permissions: IPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  permissions: string[]; // Array of permission IDs
}
