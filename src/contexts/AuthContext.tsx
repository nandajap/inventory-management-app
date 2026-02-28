//This is the "brain" - stores user, handles login/logout.

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { mockLogin, mockLogout, mockRefreshToken } from '../services/mockAuth';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Create the context (initially undefined)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for localStorage
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true); // true during initial check

    const navigate = useNavigate();
    const isAuthenticated = !!user;

    // LOGIN MUTATION
    const loginMutation = useMutation({
        mutationFn: mockLogin,
        onSuccess: ({ user, tokens }) => {
            setUser(user);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            navigate('/inventory', {replace:true});
        }
    });

    const logoutMutation = useMutation({
        mutationFn: mockLogout,
        onSuccess: () => {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            navigate('/login', {replace:true});
        }
    })



    // ON APP LOAD: Check if user was already logged in
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check localStorage for refresh token
                const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

                if (storedRefreshToken && storedUser) {
                    // User was logged in - get fresh access token
                    const tokens = await mockRefreshToken(storedRefreshToken);

                    setUser(JSON.parse(storedUser));

                    // Update token 
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
                }
            } catch (error) {
                // Refresh failed - clear everything
                console.error('Failed to restore session:', error);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
            } finally {
                setIsInitializing(false); // Done checking
            }
        };

        initializeAuth();
    }, []); // Run once on mount

    // LOGIN FUNCTION: Called from Login page
    const login = async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
    };

    // LOGOUT
    const logout = () => {
        logoutMutation.mutate();
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated,
        isLoading: isInitializing // Only true during initial app load
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};