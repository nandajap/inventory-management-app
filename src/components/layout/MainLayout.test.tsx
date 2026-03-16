import { render } from "@testing-library/react";
import MainLayout from "./MainLayout";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { it } from "vitest";

const queryClient = new QueryClient();

it("renders MainLayout structure", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
});