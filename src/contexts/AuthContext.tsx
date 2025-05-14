import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import usersData from '../data/users.json';

// Define types
interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and methods to the entire application:
 * - isAuthenticated: boolean indicating if user is authenticated
 * - user: the current user object (or null if not authenticated)
 * - login: function to authenticate a user
 * - logout: function to sign out the current user
 * - hasPermission: function to check if the current user has a specific permission
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if there's a saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Simulates a login process using the dummy data
   * In a real app, this would make an API call to authenticate
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For now, we'll simulate by using the dummy users data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in our dummy data
    const foundUser = usersData.users.find(u => u.username === username);
    
    // In this demo, we're not checking passwords since they're not in our dummy data
    // In a real app, you'd verify the password against a hash
    if (foundUser) {
      const userToSave: User = {
        id: foundUser.id,
        username: foundUser.username,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
        permissions: foundUser.permissions,
        avatar: foundUser.avatar,
      };
      
      // Save to state and localStorage
      setUser(userToSave);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userToSave));
      
      return true;
    }
    
    return false;
  };

  /**
   * Signs out the current user
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  /**
   * Checks if the current user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Special case for admin users
    if (user.permissions.includes('view_all') || user.permissions.includes('edit_all')) {
      return true;
    }
    
    return user.permissions.includes(permission);
  };

  // Provide the auth context to children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 