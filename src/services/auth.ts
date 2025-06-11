// Simulated authentication service
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Mock users for testing
const MOCK_USERS = [
  {
    email: 'demo@skydrop.com',
    password: 'password123',
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@skydrop.com',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
    }
  },
  {
    email: 'admin@skydrop.com',
    password: 'admin123',
    user: {
      id: '2',
      name: 'Admin User',
      email: 'admin@skydrop.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3A506B&color=fff'
    }
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate API request delay
    await delay(800);
    
    // Find user in mock database
    const matchedUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (matchedUser) {
      // Store user in localStorage for persistence
      localStorage.setItem('skydrop_user', JSON.stringify(matchedUser.user));
      return {
        success: true,
        user: matchedUser.user
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  },
  
  // Sign out current user
  signOut: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem('skydrop_user');
  },
  
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('skydrop_user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (e) {
        localStorage.removeItem('skydrop_user');
      }
    }
    return null;
  }
};
