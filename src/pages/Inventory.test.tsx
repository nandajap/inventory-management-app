// src/pages/Inventory.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import Inventory from "./Inventory";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

// src/pages/Inventory.test.tsx
describe("Inventory Page", () => {
    beforeEach(() => {
        queryClient.clear();
        const now = Date.now();
        // Match the format expected by your tokenValidation.ts:
        // parts[parts.length - 1] must be a recent timestamp
        const freshToken = `access-token-admin-${now}`;
        
        localStorage.setItem('accessToken', freshToken);
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'Admin' }));
    });

    it("renders the inventory table with data from MSW", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <Inventory />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        );

        // First, wait for the loading state to disappear
        await waitFor(() => {
            expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
        }, { timeout: 5000 });

        // Now look for the data
        const laptopRow = await screen.findByText(/MacBook Pro/i);
        expect(laptopRow).toBeInTheDocument();
    });
});