import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthContext } from "../../contexts/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

const renderWithAuth = (isAuthenticated: boolean, isLoading: boolean) => {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthContext.Provider value={{ 
        isAuthenticated, 
        isLoading, 
        user: null, role: null, login: vi.fn(), logout: vi.fn() 
      }}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={<ProtectedRoute><div>Secret Content</div></ProtectedRoute>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  it("shows loading spinner when initializing", () => {
    renderWithAuth(false, true);
    expect(screen.getByText(/Verifying access/i)).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    renderWithAuth(false, false);
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    renderWithAuth(true, false);
    expect(screen.getByText(/Secret Content/i)).toBeInTheDocument();
  });
});