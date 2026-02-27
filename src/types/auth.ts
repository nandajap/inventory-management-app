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
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean; // Only true during initial session restore
}

export interface LoginCredentials{
    email:string;
    password:string;
}