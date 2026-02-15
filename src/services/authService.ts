/**
 * Authentication Service
 * Handles user login, signup, and session management.
 */

interface User {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  /**
   * Log in with email and password
   */
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo credentials check
    if (email === 'demo@paylockr.com' && password === 'PayLockr@123') {
      const user = {
        id: 'demo-user-001',
        email: email,
        name: 'Demo User'
      };
      authService.setSession(user);
      return user;
    }

    // Allow generic login for prototype if valid format
    if (email.includes('@') && password.length >= 8) {
      const user = {
        id: `user-${Date.now()}`,
        email: email,
        name: email.split('@')[0]
      };
      authService.setSession(user);
      return user;
    }

    throw new Error('Invalid credentials');
  },

  /**
   * Sign up new user
   */
  signup: async (email: string, password: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = {
      id: `user-${Date.now()}`,
      email,
      name
    };
    authService.setSession(user);
    return user;
  },

  /**
   * Mock Google Login
   */
  loginWithGoogle: async (token?: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate successful Google auth
    const user = {
      id: `google-user-${Date.now()}`,
      email: 'google-user@example.com',
      name: 'Google User'
    };
    authService.setSession(user);
    return user;
  },

  /**
   * Log out current user
   */
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('paylockr_user');
    sessionStorage.removeItem('paylockr_user');
  },

  /**
   * Get current session user
   */
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('paylockr_user') || sessionStorage.getItem('paylockr_user');
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Helper to set session
   */
  setSession: (user: User, remember: boolean = true) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('paylockr_user', JSON.stringify(user));
  }
};