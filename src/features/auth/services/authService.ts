import { apiClient } from '../../../core/api/client';
import type { User } from '../../../core/types/domain';

export interface LoginDTO {
  username?: string; // Or email, depending on backend impl
  email?: string;
  password?: string; 
}

interface AuthResponse {
  token: string;
  user?: User; // Optional depending on backend response
}

interface RegisterDTO {
  username: string;
  email: string;
  password?: string; 
  fullName: string;
}

export const authService = {
  // Register: POST /api/auth/register
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      ...data,
      password: data.password || '123456' 
    });
    // Save token if returned
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login: POST /api/auth/login
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          // If user is returned, save numeric ID for legacy components that might still look for it locally?? 
          // Actually, we are removing userId dependency, so maybe not needed.
          // But 'useAuth' might need it.
          if (response.data.user?.id) {
              localStorage.setItem('userId', response.data.user.id.toString());
          }
      }
      return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  // Obtener usuario actual: GET /api/usuarios/me (Assumption, or maybe we rely on stored user)
  // Since we are removing /usuarios/{id}, maybe there is a /me endpoint?
  // The user didn't specify a /me endpoint. But said "AuthenticatedUserService...". 
  // Let's keep getById as legacy or remove it if not needed. 
  // For now I will comment out getById since the goal is to remove usage of ID.
};
