import axios from 'axios';

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface RegisterResponse {
  message: string;
  data: {
    user_id: string;
    full_name: string;
    email: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

interface UserProfile {
  user_id: string;
  email: string;
  full_name: string;
  jersey_name?: string;
  date_of_birth?: string;
  role?: string;
  profile_picture?: string;
}

const API_URL = '/api/auth';

export const authService = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  },
};
