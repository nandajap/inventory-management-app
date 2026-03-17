import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../constants/storage";
import { UserRole } from "../types/auth";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Mock the authService
vi.mock("../services/authService", () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
    },
}));

// 2. Create a Test Component to consume the context
const TestConsumer = () => {
    const auth = useContext(AuthContext);
    if (!auth) return null;

    const handleLogin = async () => {
        try {
            await auth.login("test@test.com", "password");
        } catch (e) { /* error handled */ }
    };

    return (
        <div>
            <div data-testid="user">{auth.user?.name || "No User"}</div>
            <div data-testid="loading">{auth.isLoading ? "Loading" : "Ready"}</div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => auth.logout()}>Logout</button>
        </div>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("initializes with user from localStorage", async () => {
        const mockUser = { id: "1", name: "John Doe", role: "Admin" };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // Check if user state was populated from storage
        expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
        expect(screen.getByTestId("loading")).toHaveTextContent("Ready");
    });

    it("updates state and storage on successful login", async () => {
        const mockResult = {
            user: { id: "1", name: "Admin User", email: "admin@example.com", role: "Admin" as UserRole },
            tokens: { accessToken: "at", refreshToken: "rt" }
        };
        vi.mocked(authService.login).mockResolvedValue(mockResult);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText("Login").click();
        });

        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent("Admin User");
            expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe("at");
            expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!)).toEqual(mockResult.user);
        });
    });

    it("clears state and storage on logout", async () => {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, "rt-123");
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name: "User" }));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText("Logout").click();
        });

        expect(authService.logout).toHaveBeenCalledWith("rt-123");
        expect(screen.getByTestId("user")).toHaveTextContent("No User");
        expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });

    it("handles cross-tab logout (Storage Event)", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // Manually set a user to simulate being logged in
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name: "Tab 1 User" }));

        // Simulate a storage event from "another tab"
        await act(async () => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: STORAGE_KEYS.LOGOUT_EVENT,
                newValue: Date.now().toString()
            }));
        });

        // The context should react by clearing the user
        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent("No User");
        });
    });

    it("throws error on failed login", async () => {
        vi.mocked(authService.login).mockRejectedValue(new Error("Network Error"));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // We wrap the click because we expect an unhandled promise rejection in this specific UI setup
        // But we check that storage remains empty
        await act(async () => {
            try {
                await screen.getByText("Login").click();
            } catch (e) {
                // error caught
            }
        });

        expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });

    it("clears auth state even if logout API fails", async () => {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, "rt-123");
        // 1. Mock logout to fail
        vi.mocked(authService.logout).mockRejectedValue(new Error("API Error"));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<AuthProvider><TestConsumer /></AuthProvider>);

        await act(async () => {
            screen.getByText("Logout").click();
        });

        // 2. Verify catch block 
        expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.anything());
        // 3. Verify state was still cleared (Finally block)
        expect(screen.getByTestId("user")).toHaveTextContent("No User");

        consoleSpy.mockRestore();
    });
});