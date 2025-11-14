import React, { useEffect, useState, createContext, useContext } from 'react';
import { toast } from 'sonner';
// Define types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: number; // 0 = pending, 1 = active
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  activateAccount: (token: string) => Promise<boolean>;
}
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordHint: string;
  role: 'student' | 'instructor' | 'admin';
}
// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Mock users for demo purposes
const mockUsers = [{
  id: '1',
  firstName: 'John',
  lastName: 'Student',
  email: 'student@example.com',
  password: 'password123',
  role: 'student',
  status: 1
}, {
  id: '2',
  firstName: 'Jane',
  lastName: 'Instructor',
  email: 'instructor@example.com',
  password: 'password123',
  role: 'instructor',
  status: 1
}, {
  id: '3',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin',
  status: 1
}];
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        toast.error('Invalid email or password');
        return false;
      }
      if (foundUser.status === 0) {
        toast.error('Account not activated. Please check your email for activation link.');
        return false;
      }
      // Remove password before storing
      const {
        password: _,
        ...userWithoutPassword
      } = foundUser;
      // Store user in state and localStorage
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        toast.error('Email already exists');
        return false;
      }
      // In a real app, this would create a user in the database
      // and send an activation email
      toast.success('Registration successful! Please check your email for activation link.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('You have been logged out');
  };
  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Check if email exists
      const userExists = mockUsers.some(u => u.email === email);
      if (!userExists) {
        // Don't reveal if email exists for security reasons
        toast.success('If your email is registered, you will receive a password reset link');
        return true;
      }
      // In a real app, this would send a password reset email
      toast.success('If your email is registered, you will receive a password reset link');
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to process request');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Reset password function
  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would validate the token and update the password
      toast.success('Password reset successful! You can now login with your new password.');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to reset password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Activate account function
  const activateAccount = async (token: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would validate the token and activate the account
      toast.success('Account activated successfully! You can now login.');
      return true;
    } catch (error) {
      console.error('Account activation error:', error);
      toast.error('Failed to activate account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    activateAccount
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};