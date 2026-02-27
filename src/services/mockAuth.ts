import { User, AuthTokens, LoginCredentials } from "../types/auth";

const MOCK_USERS: Record<string, { password: string; user: User }> = {
    'admin@test.com': {
        password: 'admin123',
        user: {
            id: '1',
            email: 'admin@test.com',
            name: 'Admin User',
            role: 'Admin'
        }
    },
    'viewer@test.com': {
        password: 'viewer123',
        user: {
            id: '2',
            email: 'viewer@test.com',
            name: 'Viewer User',
            role: 'Viewer'
        }
    }
};
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate fake tokens 
const generateTokens = (userId: string): AuthTokens => ({
    accessToken: `access-token-${userId}-${Date.now()}`,
    refreshToken: `refresh-token-${userId}-${Date.now()}`
});

export const mockLogin = async (credentials: LoginCredentials):
    Promise<{ user: User; tokens: AuthTokens }> => {

    await delay(800);
    const userRecord = MOCK_USERS[credentials.email];

    // Invalid credentials
    if (!userRecord || userRecord.password !== credentials.password) {
        throw new Error('Invalid email or password');
    }

    // Success - return user and tokens
    return {
        user: userRecord.user,
        tokens: generateTokens(userRecord.user.id)
    };

}

export const mockRefreshToken = async (refreshToken: string): Promise<AuthTokens> => {
    await delay(500);

    // Extract user ID from refresh token 
    const userId = refreshToken.split('-')[2];

    if (!userId) {
        throw new Error('Invalid refresh token');
    }

    return generateTokens(userId);
}

// LOGOUT: Invalidate tokens 
export const mockLogout = async (): Promise<void> => {
  await delay(300);
  // In real app, server would invalidate tokens
  console.log('User logged out');
};