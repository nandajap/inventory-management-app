import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { describe, it, expect, vi } from "vitest";

describe("useAuth Hook", () => {
    it("throws error when used outside of AuthProvider", () => {
        // Prevent console.error from cluttering the output during a planned error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => renderHook(() => useAuth())).toThrow("useAuth must be used within AuthProvider");
        
        consoleSpy.mockRestore();
    });
});