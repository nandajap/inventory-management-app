import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isTokenExpired, validateAuthToken } from './tokenValidation';

describe('tokenValidation', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('isTokenExpired', () => {
        it('returns true for EXPIRED_TOKEN special string', () => {
            expect(isTokenExpired('some-EXPIRED_TOKEN-data')).toBe(true);
        });

        it('returns false if no timestamp is present', () => {
            expect(isTokenExpired('access-token-user123-notimestamp')).toBe(false);
        });

        it('returns false for a fresh access token', () => {
            const now = Date.now();
            const token = `access-token-user123-${now}`;
            expect(isTokenExpired(token)).toBe(false);
        });

        it('returns true for an access token older than 15 minutes', () => {
            const oldTime = Date.now() - (16 * 60 * 1000);
            const token = `access-token-user123-${oldTime}`;
            expect(isTokenExpired(token)).toBe(true);
        });
    });

    describe('validateAuthToken', () => {
        it('returns 401 if Authorization header is missing', () => {
            const request = new Request('https://api.test.com');
            const result = validateAuthToken(request);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.response.status).toBe(401);
            }
        });

        it('returns success and userId for a valid token', () => {
            const now = Date.now();
            const token = `access-token-user789-${now}`;
            const request = new Request('https://api.test.com', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = validateAuthToken(request);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.userId).toBe('user789');
            }
        });

        it('returns 401 when the token in the header is expired', () => {
            // Create a token that is 20 minutes old (Access tokens expire at 15m)
            const expiredTimestamp = Date.now() - (20 * 60 * 1000);
            const token = `access-token-user123-${expiredTimestamp}`;

            const request = new Request('https://api.test.com', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = validateAuthToken(request);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.response.status).toBe(401);
            }
        });

    });
});