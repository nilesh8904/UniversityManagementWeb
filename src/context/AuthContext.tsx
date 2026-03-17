import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'admin@university.edu', role: 'university_admin' },
  { id: '2', name: 'Prof. Michael Chen', email: 'college@admin.edu', role: 'college_admin', collegeId: 'col1' },
  { id: '3', name: 'John Smith', email: 'student@edu.com', role: 'student', collegeId: 'col1', studentId: 'STU001' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      // Store JWT token in localStorage (mock)
      localStorage.setItem('token', `mock-jwt-token-${foundUser.id}`);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}