import { render, screen, fireEvent } from "@testing-library/react"
import { TopNavbar } from "./TopNavbar"
import { MemoryRouter } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn()
}))

describe("TopNavbar", () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock state: User is logged in
    ;(useAuth as any).mockReturnValue({
      user: { name: "Test User", role: "Admin" },
      logout: mockLogout
    })
  })

  it("displays the user name and role", () => {
    render(
      <MemoryRouter>
        <TopNavbar />
      </MemoryRouter>
    )
    expect(screen.getByText("Test User")).toBeInTheDocument()
    expect(screen.getByText("Admin")).toBeInTheDocument()
  })

  it("handles logout process correctly", () => {
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)
    
    render(
      <MemoryRouter>
        <TopNavbar />
      </MemoryRouter>
    )

    const logoutBtn = screen.getByRole("button", { name: /logout/i })
    fireEvent.click(logoutBtn)

    expect(confirmSpy).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled()
    
    confirmSpy.mockRestore()
  })

  it("cancels logout if user denies confirmation", () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false)
    
    render(
      <MemoryRouter>
        <TopNavbar />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole("button", { name: /logout/i }))

    expect(mockLogout).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })
})