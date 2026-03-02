import apiClient from "./axios";
import { LoginCredentials, User, AuthTokens } from "../types/auth";
import { LoginResponse, RefreshResponse } from "../types/auth";



//login
export const authService = {
    login: async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

        return {
            user: response.data.user,
            tokens: {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            },
        };
    },

    // Refresh token
    refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
        const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });

        return {
            accessToken: response.data.accessToken,
            refreshToken: refreshToken, // Keep the same refresh token
        };
    },

    // Logout
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/auth/logout', { refreshToken });
    },

    // Get current user
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },


}