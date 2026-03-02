export interface User {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Viewer';

}

export interface AuthTokens {
    refreshToken: string;
    accessToken: string;
}

export interface AuthContextType {
    user: User | null;              // null = not logged in
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean; // Only true during initial session restore
}

export interface LoginCredentials{
    email:string;
    password:string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string
}