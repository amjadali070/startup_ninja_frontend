export interface User {
  id: string;
  fullname?: string;
  email: string;
  name: string;
  username?: string;
  role?: 'admin' | 'user';
  picture?: string | null;
  country?: string;
  phoneNumber?: string;
  loginType?: 'Apple' | 'Microsoft' | 'Google' | 'Email';
  status?: 'active' | 'inactive';
  isEmailVerified?: boolean;
  addedBy?: string;
  teamRole?: 'Member' | 'Manager' | string;
  permissions?: {
    sales?: boolean;
    ops?: boolean;
    finance?: boolean;
    legal?: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  isNewUser?: boolean;
  requiresEmailVerification?: boolean;
  userId?: string;
  email?: string;
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
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  country?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
