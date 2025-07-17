import axios from 'axios';
import { API_BASE_URL, AUTH } from '../config';
import JwtModel from "../model/jwt-model";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

class AuthService {
  private static _instance: AuthService;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }
    return AuthService._instance;
  }

  // Authentication
  async authenticate(username: string, password: string): Promise<any> {
    try {
      const response = await instance.post(AUTH.LOGIN, new JwtModel(username, password));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User Registration
  async register(firstname: string, lastname: string, email: string, password: string): Promise<any> {
    try {
      const response = await instance.post(AUTH.REGISTER, {
        firstname,
        lastname,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await instance.post(AUTH.LOGOUT);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Protected Route Test
  async testRoute(): Promise<any> {
    try {
      const response = await instance.get("/fetch");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Group Management
  async createGroup(groupName: string): Promise<any> {
    try {
      const response = await instance.post("/groups", { name: groupName });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Message Handling
  async fetchMessages(groupId: number): Promise<any> {
    try {
      const response = await instance.get(`/messages/${groupId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Group Membership
  async addUserToGroup(userId: number | string, groupId: string): Promise<any> {
    try {
      const response = await instance.post(`/groups/${groupId}/members`, { userId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): { message: string } {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return { message: 'Network Error: Could not connect to server' };
    } else {
      console.error('Error:', error.message);
      return { message: error.message };
    }
  }

  static setupInterceptors(store: any): void {
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          store.dispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}

// Export both the class and the singleton instance
export const authService = AuthService.getInstance();
export default AuthService;
