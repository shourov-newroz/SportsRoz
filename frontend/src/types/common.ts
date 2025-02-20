// server response
export interface IApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface IFormSubmissionResponse {
  message: string;
  status: number;
  success: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Interface for Server Error Response
export interface IServerErrorResponse {
  error?: { reason: string[] };
}

export interface IFormErrors {
  [key: string]: string | undefined | null;
}

export type IFormServerErrors = string[];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IRequestMetaInfo {
  requestId: string;
  source: string;
  versionCode: string;
  versionName: string;
  networkType: string;
  deviceID: string;
  deviceOSCode: number;
  deviceOSName: string;
  deviceName: string;
  language: string;
  latitude: number;
  longitude: number;
  message: string;
  status: number;
  success: boolean;
}
