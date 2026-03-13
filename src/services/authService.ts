import apiClient from "./axios";
import { LoginCredentials, User, AuthTokens } from "../types/auth";
import { LoginResponse } from "../types/auth";



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

    // Logout
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/auth/logout', { refreshToken });
    },

}