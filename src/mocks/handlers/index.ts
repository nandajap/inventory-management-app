import { authHandlers } from './auth.handlers';
import { productsHandlers } from './products.handlers';

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...productsHandlers,
];