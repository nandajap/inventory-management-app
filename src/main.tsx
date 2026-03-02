import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Start MSW 
async function enableMocking() {

  const { worker } = await import('./mocks/browser');

  // Start the worker
  return worker.start({
    onUnhandledRequest: 'warn', // Warn about requests MSW doesn't handle
  });
}

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes (won't refetch during this time)
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch when user switches back to browser tab
      refetchOnWindowFocus: true,
      // Retry failed requests once before showing error
      retry: 1
    },
  },
})

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
});

