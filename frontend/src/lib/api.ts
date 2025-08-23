// API Service Layer for Backend Communication
import type { ApiResponse, User, Course, Enrollment, Payment, AuthTokens } from '../types/shared';

const API_BASE_URL = 'http://localhost:3000'; // NestJS default port

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Helper method to build full URL
  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic fetch method with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(this.buildUrl(endpoint), {
        headers: this.getAuthHeaders(),
        ...options,
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        console.log('Unauthorized response received, performing logout cleanup');
        localStorage.removeItem('access_token');

        // Import the programmatic logout function to handle cleanup
        import('./logoutService').then(({ performProgrammaticLogout }) => {
          performProgrammaticLogout();
        }).catch(() => {
          // Fallback if import fails
          window.location.href = '/login';
        });

        return {
          success: false,
          error: 'Unauthorized - redirecting to login',
          statusCode: 401
        };
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status
        };
      }

      // Handle successful responses
      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status
      };

    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
        statusCode: 500
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ access_token: string; user: User }>> => {
    const response = await apiService.post<{ access_token: string; user: User }>('/auth/login', { email, password });
    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<ApiResponse<{ user: User; access_token: string }>> => {
    return apiService.post<{ user: User; access_token: string }>('/auth/register', userData);
  },

  logout: (): void => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>('/auth/profile');
  },
};

// Courses API calls
export const coursesAPI = {
  getAll: async (params?: {
    status?: string;
    instructorId?: string;
    category?: string;
    level?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Course[]>> => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return apiService.get<Course[]>(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string): Promise<ApiResponse<Course>> => {
    return apiService.get<Course>(`/courses/${id}`);
  },

  getFeatured: async (): Promise<ApiResponse<Course[]>> => {
    return apiService.get<Course[]>('/courses/featured');
  },

  search: async (query: string): Promise<ApiResponse<Course[]>> => {
    return apiService.get<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`);
  },

  create: async (courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    return apiService.post<Course>('/courses', courseData);
  },

  update: async (id: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    return apiService.put<Course>(`/courses/${id}`, courseData);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`/courses/${id}`);
  },

  enroll: async (courseId: string, enrollmentData?: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    return apiService.post<Enrollment>(`/courses/${courseId}/enroll`, enrollmentData);
  },
};

// Users API calls
export const usersAPI = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return apiService.get<User[]>('/users');
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiService.get<User>(`/users/${id}`);
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>('/users/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiService.put<User>('/users/profile', userData);
  },

  getMyCourses: async (): Promise<ApiResponse<Course[]>> => {
    return apiService.get<Course[]>('/users/my-courses');
  },
};

// Enrollments API calls
export const enrollmentsAPI = {
  getAll: async (): Promise<ApiResponse<Enrollment[]>> => {
    return apiService.get<Enrollment[]>('/enrollments');
  },

  getById: async (id: string): Promise<ApiResponse<Enrollment>> => {
    return apiService.get<Enrollment>(`/enrollments/${id}`);
  },

  create: async (enrollmentData: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    return apiService.post<Enrollment>('/enrollments', enrollmentData);
  },

  updateProgress: async (id: string, progressData: Partial<Enrollment>): Promise<ApiResponse<Enrollment>> => {
    return apiService.put<Enrollment>(`/enrollments/${id}/progress`, progressData);
  },
};

// Payments API calls
export const paymentsAPI = {
  getAll: async (): Promise<ApiResponse<Payment[]>> => {
    return apiService.get<Payment[]>('/payments');
  },

  create: async (paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> => {
    return apiService.post<Payment>('/payments', paymentData);
  },

  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    return apiService.get<Payment>(`/payments/${id}`);
  },
};

// Search API calls
export const searchAPI = {
  searchCourses: async (query: string): Promise<ApiResponse<Course[]>> => {
    return apiService.get<Course[]>(`/search/courses?q=${encodeURIComponent(query)}`);
  },
};

export default apiService;