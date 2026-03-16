import { render } from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it } from "vitest";

const queryClient = new QueryClient();

describe("App Smoke Test", () => {
  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  });
});