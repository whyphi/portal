"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';
import { Session } from 'next-auth';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session: Session | null) => {
      if (session) {
        // Use type assertion to add the 'token' property
        const sessionWithToken = session as Session & { token?: string };
  
        if (sessionWithToken.token) {
          const signedToken = jwt.sign(sessionWithToken.token, `${process.env.NEXT_PUBLIC_JWT_SECRET}`, {
            algorithm: 'HS256',
          });
          setToken(signedToken);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, isLoading }}>
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