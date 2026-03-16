import { render, screen } from "@testing-library/react";
import PermissionGuard from "./PermissionGuard";
import { AuthContext } from "../../contexts/AuthContext";
import { describe, it, expect, vi } from "vitest";

describe("PermissionGuard", () => {
  const renderGuard = (role: 'Admin' | 'Viewer') => {
    return render(
      <AuthContext.Provider value={{ 
        role, isAuthenticated: true, isLoading: false, 
        user: null, login: vi.fn(), logout: vi.fn() 
      }}>
        <PermissionGuard permission="product.delete" fallback={<div>No Permission</div>}>
          <button>Delete Product</button>
        </PermissionGuard>
      </AuthContext.Provider>
    );
  };

  it("renders children if user has permission", () => {
    renderGuard('Admin');
    expect(screen.getByText(/Delete Product/i)).toBeInTheDocument();
  });

  it("renders fallback if user lacks permission", () => {
    renderGuard('Viewer');
    expect(screen.getByText(/No Permission/i)).toBeInTheDocument();
  });
});