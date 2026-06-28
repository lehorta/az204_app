import { getApiUrl } from '../config/api';
import { createApiError } from './apiError';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  publicId: string;
  academyId: string;
  nome: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  expiresAt: string | null;
}

// Storage keys
const TOKEN_KEY = 'gym_auth_token';
const REFRESH_TOKEN_KEY = 'gym_refresh_token';
const USER_KEY = 'gym_user';
const EXPIRES_AT_KEY = 'gym_expires_at';

// Auth Service
export const authService = {
  /**
   * Faz login na API
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${getApiUrl()}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw createApiError(error, 'Erro ao realizar login');
    }

    const data: AuthResponse = await response.json();

    // Salva dados no localStorage
    this.saveAuthData(data);

    return data;
  },

  /**
   * Faz logout
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  /**
   * Salva dados de autenticação no localStorage
   */
  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    localStorage.setItem(EXPIRES_AT_KEY, authResponse.expiresAt);
  },

  /**
   * Recupera estado de autenticação do localStorage
   */
  getAuthState(): AuthState {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      user: localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null,
      expiresAt: localStorage.getItem(EXPIRES_AT_KEY),
    };
  },

  /**
   * Verifica se usuario está autenticado
   */
  isAuthenticated(): boolean {
    const state = this.getAuthState();
    return !!state.token && !!state.user;
  },

  /**
   * Retorna o token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Retorna o usuário autenticado
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verifica se token expirou
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (!expiresAt) return true;
    return new Date(expiresAt) <= new Date();
  },
};
