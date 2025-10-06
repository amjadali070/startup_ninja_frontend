export interface User {
  id: string;
  fullname?: string;
  email: string;
  name: string;
  username?: string;
  role?: 'admin' | 'user';
  picture?: string | null;
  country?: string;
  phone_number?: string;
  loginType?: 'Apple' | 'Microsoft' | 'Google' | 'Email';
  status?: 0 | 1;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  isNewUser?: boolean;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface GoogleAuthPayload {
  credential?: string;
  accessToken?: string;
}

export interface MicrosoftAuthPayload {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
