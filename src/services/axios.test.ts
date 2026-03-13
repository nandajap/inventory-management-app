import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './axios';

describe('Axios Interceptors', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
    });
  });

  it('adds Authorization header if token exists in localStorage', async () => {
    // 1. Mock a token in localStorage
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token');

    // 2. Trigger a request (interceptors run automatically)
    const config = await (apiClient.interceptors.request as any).handlers[0].fulfilled({
      headers: {}
    });

    expect(config.headers.Authorization).toBe('Bearer fake-token');
  });

  it('does not add Authorization header if no token exists', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const config = await (apiClient.interceptors.request as any).handlers[0].fulfilled({
      headers: {}
    });

    expect(config.headers.Authorization).toBeUndefined();
  });
});