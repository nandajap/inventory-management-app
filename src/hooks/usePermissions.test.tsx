import { renderHook } from "@testing-library/react";
import { usePermissions } from "./usePermissions";
import { AuthContext } from "../contexts/AuthContext";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { AuthContextType, UserRole } from "../types/auth";

describe("usePermissions Hook", () => {
    // 1. Create a helper to wrap the hook in the Provider
    const createWrapper = (role: UserRole | null) => {
        const mockAuthValue: AuthContextType = {
            user: role ? { id: '1', name: 'Test', role, email: 't@t.com' } : null,
            role: role,
            isAuthenticated: !!role,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
        };

        return ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={mockAuthValue}>
                {children}
            </AuthContext.Provider>
        );
    };

    it("returns true for product.delete when role is Admin", () => {
        const { result } = renderHook(() => usePermissions(), { 
            wrapper: createWrapper('Admin') 
        });
        
        expect(result.current.can('product.delete')).toBe(true);
        expect(result.current.isAdmin).toBe(true);
    });

    it("returns false for product.delete when role is Viewer", () => {
        const { result } = renderHook(() => usePermissions(), { 
            wrapper: createWrapper('Viewer') 
        });

        expect(result.current.can('product.delete')).toBe(false);
        expect(result.current.isViewer).toBe(true);
    });

    it("returns true for product.view when role is Viewer", () => {
        const { result } = renderHook(() => usePermissions(), { 
            wrapper: createWrapper('Viewer') 
        });

        expect(result.current.can('product.view')).toBe(true);
    });
});