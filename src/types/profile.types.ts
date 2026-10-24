export type UserRole = 'operations' | 'admin' | 'fleet_manager' | 'dispatcher' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  error?: string;
  message?: string;
}
