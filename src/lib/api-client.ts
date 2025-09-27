/**
 * Tracklet API Client
 *
 * Centralized API client with environment-based configuration
 * Handles authentication, base URL, and common request patterns
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Import supabase dynamically to avoid SSR issues
      const { supabase } = await import('./supabase');

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        return {
          'Authorization': `Bearer ${session.access_token}`,
        };
      }
    } catch (error) {
//      console.warn('Failed to get auth token:', error);
    }

    return {};
  }

  /**
   * Make an API request
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, headers = {}, ...restOptions } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge additional headers
    if (headers) {
      Object.assign(requestHeaders, headers as Record<string, string>);
    }

    // Add auth headers if required
    if (requiresAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(requestHeaders, authHeaders);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout - please check your connection and try again',
        };
      }

 //      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET request
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export default ApiClient;

// Convenience functions for common operations
export const api = {
  // Transactions
  getTransactions: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/transactions${query}`);
  },
  createTransaction: (data: any) => apiClient.post('/transactions', data),
  getTransaction: (id: string) => apiClient.get(`/transactions/${id}`),
  updateTransaction: (id: string, data: any) => apiClient.patch(`/transactions/${id}`, data),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),

  // Accounts
  getAccounts: () => apiClient.get('/accounts'),
  createAccount: (data: any) => apiClient.post('/accounts', data),
  getAccount: (id: string) => apiClient.get(`/accounts/${id}`),
  updateAccount: (id: string, data: any) => apiClient.patch(`/accounts/${id}`, data),
  deleteAccount: (id: string) => apiClient.delete(`/accounts/${id}`),

  // Categories
  getCategories: () => apiClient.get('/categories'),
  createCategory: (data: any) => apiClient.post('/categories', data),
  getCategory: (id: string) => apiClient.get(`/categories/${id}`),
  updateCategory: (id: string, data: any) => apiClient.patch(`/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),

  // Budgets
  getBudgets: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/budgets${query}`);
  },
  createBudget: (data: any) => apiClient.post('/budgets', data),
  getBudget: (id: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/budgets/${id}${query}`);
  },
  updateBudget: (id: string, data: any) => apiClient.patch(`/budgets/${id}`, data),
  deleteBudget: (id: string) => apiClient.delete(`/budgets/${id}`),

  // Goals
  getGoals: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/goals${query}`);
  },
  createGoal: (data: any) => apiClient.post('/goals', data),
  getGoal: (id: string, params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiClient.get(`/goals/${id}${query}`);
  },
  updateGoal: (id: string, data: any) => apiClient.patch(`/goals/${id}`, data),
  deleteGoal: (id: string) => apiClient.delete(`/goals/${id}`),

  // Profile
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data: any) => apiClient.patch('/profile', data),
};