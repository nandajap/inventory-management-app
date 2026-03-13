import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService';
import apiClient from './axios';

vi.mock('./axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

describe('authService', () => {
    it('login saves and returns user and tokens', async () => {
        const mockResponse = {
            data: {
                user: { id: '1', email: 'test@test.com', role: 'Admin' },
                accessToken: 'access',
                refreshToken: 'refresh'
            }
        };
        vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

        const credentials = { email: 'test@test.com', password: 'password' };
        const result = await authService.login(credentials);

        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
        expect(result.user.role).toBe('Admin');
        expect(result.tokens.accessToken).toBe('access');
    });

    it('logout sends the refreshToken in an object', async () => {
        const refreshToken = 'refresh-123';
        vi.mocked(apiClient.post).mockResolvedValue({ data: {} });
        await authService.logout(refreshToken);
        expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: refreshToken });
    });

});