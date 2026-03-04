import { User, AuthTokens } from "../../types/auth";
import { http, HttpResponse } from 'msw';
import { isTokenExpired } from "../../utils/tokenValidation";

const BASE_URL = 'https://api.inventoryapp.com';

const MOCK_USERS: Record<string, { password: string; user: User }> = {
    'admin@example.com': {
        password: 'admin123',
        user: {
            id: '1',
            email: 'admin@example.com',
            name: 'Kyle Henry',
            role: 'Admin'
        }
    },
    'viewer@example.com': {
        password: 'viewer123',
        user: {
            id: '2',
            email: 'viewer@example.com',
            name: 'Jen Cooper',
            role: 'Viewer'
        }
    },
    'john@example.com': {
        password: 'admin321',
        user: {
            id: '3',
            email: 'john@example.com',
            name: 'John Samuel',
            role: 'Admin'
        }
    }
};

// Generate fake tokens 
const generateTokens = (userId: string): AuthTokens => ({
    accessToken: `access-token-${userId}-${Date.now()}`,
    refreshToken: `refresh-token-${userId}-${Date.now()}`
});

export const authHandlers = [

    //Login
    http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("MSW: POST /auth/login called");

        const { email, password } = await request.json() as { email: string; password: string };
        const userRecord = MOCK_USERS[email];
        if (!userRecord || userRecord.password !== password) {
            return HttpResponse.json(
                { message: 'Invalid email or password' },
                { status: 404 }
            );
        }
        const tokens = generateTokens(userRecord.user.id);

        console.log("MSW: Login successful, token :" + tokens);

        return HttpResponse.json({
            user: userRecord.user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }),

    //Refresh token
    http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const { refreshToken } = await request.json() as { refreshToken: string };
        
        //Check if refresh token is expired
        if (isTokenExpired(refreshToken)) {
            return HttpResponse.json(
                { message: 'Refresh token expired' },
                { status: 401 }
            );
        }

        // Extract user ID from refresh token 
        const userId = refreshToken.split('-')[2];
        if (!userId) {
            return HttpResponse.json(
                { message: 'Invalid refresh token' },
                { status: 401 }
            );
        }
        console.log('MSW: Refresh token valid, generating new tokens');
        const tokens = generateTokens(userId);

        return HttpResponse.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }),

    //Logout
    http.post(`${BASE_URL}/auth/logout`, async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return HttpResponse.json({ message: 'Logged out successfully' });
    }),
];