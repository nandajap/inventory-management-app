import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the MSW worker with all handlers
export const worker = setupWorker(...handlers);