import axios from 'axios';

const TOKEN_KEY = 'token';
const AUTH_KEY = 'isAuthenticated';
const ACCOUNT_ID_KEY = 'accountId';
const ROLE_ID_KEY = 'roleId';

interface TokenPayload {
  exp: number;
  UserId: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  jti: string;
  [key: string]: any;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, 'true');

    // Parse token to get accountId and roleId
    try {
      const payload = this.parseJwt(token);
      console.log('Token payload:', payload);
      
      if (payload.UserId) {
        localStorage.setItem(ACCOUNT_ID_KEY, payload.UserId);
      }
      if (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
        const roleId = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log('Setting RoleId:', roleId);
        localStorage.setItem(ROLE_ID_KEY, roleId);
      } else {
        console.log('No RoleId found in token payload');
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;

    try {
      const payload = this.parseJwt(this.token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (payload.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  public getAccountId(): number | null {
    const accountId = localStorage.getItem(ACCOUNT_ID_KEY);
    return accountId ? parseInt(accountId) : null;
  }

  public getRoleId(): number | null {
    const roleId = localStorage.getItem(ROLE_ID_KEY);
    console.log('Getting RoleId from localStorage:', roleId);
    return roleId ? parseInt(roleId) : null;
  }

  public isAdmin(): boolean {
    const roleId = this.getRoleId();
    console.log('Checking isAdmin with roleId:', roleId);
    return roleId === 1;
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ACCOUNT_ID_KEY);
    localStorage.removeItem(ROLE_ID_KEY);
  }

  private parseJwt(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      throw error;
    }
  }
}

// Add axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authService = AuthService.getInstance();
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = AuthService.getInstance(); 