import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchDemoRole?: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('wf_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('wf_user');
    const savedToken = localStorage.getItem('wf_token');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error('Failed to parse cached auth state:', e);
        localStorage.removeItem('wf_token');
        localStorage.removeItem('wf_user');
      }
    } else {
      // Default to initial demo user if empty for instant dashboard preview
      const demoUser: User = {
        id: 'user-demo-admin',
        email: 'admin@acme.com',
        firstName: 'Sarah',
        lastName: 'Connor (Admin)',
        roleEnum: 'ADMIN',
        organization: { id: 'org-acme', name: 'Acme Enterprises', slug: 'acme-corp' },
        department: { id: 'dept-eng', name: 'Engineering & Product', code: 'ENG' },
      };
      setUser(demoUser);
      setToken('demo-jwt-token-2026');
      localStorage.setItem('wf_token', 'demo-jwt-token-2026');
      localStorage.setItem('wf_user', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('wf_token', newToken);
    localStorage.setItem('wf_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('wf_token');
    localStorage.removeItem('wf_user');
  };

  // Demo role switcher for testing Admin, Manager, and Employee dashboards dynamically
  const switchDemoRole = (role: UserRole) => {
    let nameMap = {
      ADMIN: { first: 'Sarah', last: 'Connor (Admin)', email: 'admin@acme.com' },
      MANAGER: { first: 'Alex', last: 'Vance (Manager)', email: 'manager@acme.com' },
      EMPLOYEE: { first: 'David', last: 'Miller (Employee)', email: 'employee@acme.com' },
    };

    const updatedUser: User = {
      id: `user-demo-${role.toLowerCase()}`,
      email: nameMap[role].email,
      firstName: nameMap[role].first,
      lastName: nameMap[role].last,
      roleEnum: role,
      organization: { id: 'org-acme', name: 'Acme Enterprises', slug: 'acme-corp' },
      department: { id: 'dept-ops', name: 'Operations & Logistics', code: 'OPS' },
    };

    setUser(updatedUser);
    localStorage.setItem('wf_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
