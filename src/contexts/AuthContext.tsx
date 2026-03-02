//This is the "brain" - stores user, handles login/logout.

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants/storage';

// Create the context (initially undefined)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true); // true during initial check

    const isAuthenticated = !!user;

    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setIsInitializing(false);
    }, []);

    // LOGIN FUNCTION: Called from Login page
    const login = async (email: string, password: string) => {
        try {
            const result = await authService.login({ email, password });
            setUser(result.user);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.tokens.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.tokens.refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
            return result.user
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            throw new Error(message);
        }
    };

    // LOGOUT
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
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