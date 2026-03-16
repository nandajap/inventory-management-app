import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login"; // Use named import as per your code
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

describe("Login Page", () => {
    // Add this to ensure every test starts from a clean slate
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("shows an error message on failed login", async () => {
        const user = userEvent.setup();
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );

        // 1. MUST WAIT for the loading spinner to go away first
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        }, { timeout: 5000 });

        // 2. Now fill the form
        await user.type(screen.getByLabelText(/Email/i), "wrong@example.com");
        await user.type(screen.getByLabelText(/Password/i), "wrongpass");

        await user.click(screen.getByRole("button", { name: /sign in/i }));

        // 3. Check for the error message
        // Using findByText because the error state update is async
        const errorMessage = await screen.findByText(/invalid email or password/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("redirects to inventory if user is already logged in", async () => {
        // 1. Pre-set the user in localStorage
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'Admin' }));
        localStorage.setItem('accessToken', 'valid-token');

        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );

        // 2. Expect to see NOTHING or the redirect happen (Login form shouldn't appear)
        await waitFor(() => {
            expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
        });
    });
});