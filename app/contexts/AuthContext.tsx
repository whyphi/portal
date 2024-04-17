"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation'


interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
}

interface CustomSession extends Session {
  token?: {
    isNewUser?: boolean;
    // Add other properties as needed
  };
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session: Session | null) => {
      if (session) {
        // Use type assertion to add the 'token' property
        const sessionWithToken = session as CustomSession;

        // Check if user is a newUser
        if (sessionWithToken.token?.isNewUser === undefined || sessionWithToken.token?.isNewUser) {
          router.push("/admin/onboarding");
        } 
  
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