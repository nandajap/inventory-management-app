import { User, AuthTokens } from "../../types/auth";
import { http, HttpResponse } from 'msw';

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

        console.log("🔍 MSW: POST /auth/login called");

        const { email, password } = await request.json() as { email: string; password: string };
        const userRecord = MOCK_USERS[email];
        if (!userRecord || userRecord.password !== password) {
            return HttpResponse.json(
                { message: 'Invalid email or password' },
                { status: 404 }
            );
        }
        const tokens = generateTokens(userRecord.user.id);

        console.log("✅ MSW: Login successful, token :"+ tokens);

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
        // Extract user ID from refresh token 
        const userId = refreshToken.split('-')[2];

        if (!userId) {
            return HttpResponse.json(
                { message: 'Invalid refresh token' },
                { status: 401 }
            );
        }

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

    // Get current user
//   http.get(`${BASE_URL}/auth/me`, ({ request }) => {
//     const authHeader = request.headers.get('Authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return HttpResponse.json(
//         { message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.replace('Bearer ', '');
//     const userId = token.split('-')[2];

//     const user = Object.values(MOCK_USERS).find(u => u.user.id === userId);

//     if (!user) {
//       return HttpResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return HttpResponse.json(user.user);
//   }),


];