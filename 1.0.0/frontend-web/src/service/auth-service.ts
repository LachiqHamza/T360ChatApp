import axios from 'axios';
import { API_BASE_URL, AUTH } from '../config'; // Import from config
import JwtModel from "../model/jwt-model";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

class AuthService {
  // Authentication
  async authenticate(username: string, password: string) {
    try {
      const response = await instance.post(AUTH.LOGIN, new JwtModel(username, password));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User Registration
  async register(firstname: string, lastname: string, email: string, password: string) {
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
  async logout() {
    try {
      await instance.post(AUTH.LOGOUT);
      // Clear client-side auth state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Protected Route Test
  async testRoute() {
    try {
      const response = await instance.get("/fetch");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Group Management
  async createGroup(groupName: string) {
    try {
      const response = await instance.post("/groups", { name: groupName });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Message Handling
  async fetchMessages(groupId: number) {
    try {
      const response = await instance.get(`/messages/${groupId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Group Membership
  async addUserToGroup(userId: number | string, groupId: string) {
    try {
      const response = await instance.post(`/groups/${groupId}/members`, { userId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error Handling
  private handleError(error: any) {
    if (error.response) {
      // Server responded with non-2xx status
      console.error('API Error:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return { message: 'Network Error: Could not connect to server' };
    } else {
      // Other errors
      console.error('Error:', error.message);
      return { message: error.message };
    }
  }

  // Add interceptors for auth token if needed
  static setupInterceptors(store: any) {
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
          // Handle unauthorized (e.g., redirect to login)
          store.dispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}
const authService = new AuthServiceImpl();
export default AuthService;