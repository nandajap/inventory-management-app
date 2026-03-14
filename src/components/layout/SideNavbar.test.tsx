import { render, screen } from "@testing-library/react"
import { SideNavbar } from "./SideNavbar"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect } from "vitest"

describe("SideNavbar", () => {
  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <SideNavbar />
      </MemoryRouter>
    )

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Inventory")).toBeInTheDocument()
    expect(screen.getByText("Orders")).toBeInTheDocument()
    expect(screen.getByText("Suppliers")).toBeInTheDocument()
    expect(screen.getByText("Reports")).toBeInTheDocument()
  })
})