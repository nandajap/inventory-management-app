import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup the DOM after each test to prevent data leaking between tests
afterEach(() => {
  cleanup();
});