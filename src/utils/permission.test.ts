import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hasPermission, getUserRole } from './permission';

describe('Permission Utilities', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        });
    });

    describe('getUserRole', () => {
        it('returns null if no user is in localStorage', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(getUserRole()).toBe(null);
        });

        it('returns the role if a valid user exists', () => {
            const mockUser = JSON.stringify({ role: 'Admin' });
            vi.mocked(localStorage.getItem).mockReturnValue(mockUser);
            expect(getUserRole()).toBe('Admin');
        });

        it('returns null and logs error on invalid JSON', () => {
            vi.mocked(localStorage.getItem).mockReturnValue('invalid-json');
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(getUserRole()).toBe(null);
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('hasPermission', () => {
        it('returns true if Admin has product.delete', () => {
            expect(hasPermission('product.delete', 'Admin')).toBe(true);
        });

        it('returns false if Viewer tries to product.delete', () => {
            expect(hasPermission('product.delete', 'Viewer')).toBe(false);
        });

        it('returns true if Viewer tries to product.view', () => {
            expect(hasPermission('product.view', 'Viewer')).toBe(true);
        });

        it('falls back to localStorage if no role is provided', () => {
            const mockUser = JSON.stringify({ role: 'Viewer' });
            vi.mocked(localStorage.getItem).mockReturnValue(mockUser);
            expect(hasPermission('product.view')).toBe(true);
            expect(hasPermission('product.create')).toBe(false);
        });

        it('handles missing user role gracefully in hasPermission', () => {
            vi.mocked(localStorage.getItem).mockReturnValue(null);
            expect(hasPermission('product.view')).toBe(false);
        });
    });
});