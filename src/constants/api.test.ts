import { describe, it, expect } from 'vitest';
import { BASE_URL } from './api';

describe('API Constants', () => {
  it('should have the correct BASE_URL', () => {
    expect(BASE_URL).toBe('/mock-api');
  });
});