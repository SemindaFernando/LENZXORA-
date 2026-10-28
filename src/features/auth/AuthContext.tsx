import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types';
import { dataService } from '../../services/dataService';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (data: { email: string; fullName: string; role: UserRole; studioName?: string; location?: string }) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session persistence via localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUserId = localStorage.getItem('lenzxora_active_user_id') || localStorage.getItem('creatorflow_active_user_id');
    if (savedUserId) {
      const found = dataService.getUserById(savedUserId);
      if (found) return found;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lenzxora_active_user_id', user.id);
    } else {
      localStorage.removeItem('lenzxora_active_user_id');
      localStorage.removeItem('creatorflow_active_user_id');
    }
  }, [user]);

  const login = async (email: string, requestedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = dataService.getUsers();
      let matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matched && email) {
        // Auto-detect admin email or fallback role
        const isAdmin = email.toLowerCase().includes('admin');
        const role = isAdmin ? 'admin' : (requestedRole || 'client');
        const newUser: UserProfile = {
          id: isAdmin ? 'admin-1' : `usr-${Date.now()}`,
          email,
          fullName: isAdmin ? 'Platform Administrator' : email.split('@')[0],
          role,
          avatarUrl: isAdmin
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
            : (role === 'photographer'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dataService.addUser(newUser);
        matched = newUser;
      }

      if (matched) {
        setUser(matched);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    fullName: string;
    role: UserRole;
    studioName?: string;
    location?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUserId = `usr-${Date.now()}`;
      const newUser: UserProfile = {
        id: newUserId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        avatarUrl: data.role === 'photographer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (data.role === 'photographer') {
        dataService.updatePhotographerProfile(newUserId, {
          id: newUserId,
          studioName: data.studioName || `${data.fullName} Photography`,
          tagline: 'Professional Photography & Visuals',
          bio: 'Passionate visual artist based in Sri Lanka.',
          location: data.location || 'Colombo',
          serviceAreas: [data.location || 'Colombo'],
          categories: ['Weddings', 'Portraits', 'Events'],
          startingPriceLkr: 25000,
          experienceYears: 2,
          isVerified: false,
          ratingAvg: 5.0,
          reviewCount: 0,
          published: true,
          avatarUrl: newUser.avatarUrl!,
          coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setUser(newUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lenzxora_active_user_id');
    localStorage.removeItem('creatorflow_active_user_id');
  };

  const switchDemoUser = (userId: string) => {
    const target = dataService.getUserById(userId);
    if (target) {
      setUser(target);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    dataService.updateUserRole(user.id, newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isLoading,
        isSupabaseActive: isSupabaseConfigured,
        login,
        register,
        logout,
        switchDemoUser,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
