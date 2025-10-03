export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  picture?: string | null;
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
