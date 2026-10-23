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
        const parsedUser: User = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          // Normalize roleEnum if backend returned role
          parsedUser.roleEnum = (parsedUser.roleEnum || (parsedUser as any).role || 'EMPLOYEE') as UserRole;
          setUser(parsedUser);
          setToken(savedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('wf_token');
          localStorage.removeItem('wf_user');
        }
      } catch (e) {
        console.error('Failed to parse cached auth state:', e);
        localStorage.removeItem('wf_token');
        localStorage.removeItem('wf_user');
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    const normalizedUser: User = {
      ...newUser,
      roleEnum: (newUser.roleEnum || (newUser as any).role || 'EMPLOYEE') as UserRole,
    };
    setToken(newToken);
    setUser(normalizedUser);
    localStorage.setItem('wf_token', newToken);
    localStorage.setItem('wf_user', JSON.stringify(normalizedUser));
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
