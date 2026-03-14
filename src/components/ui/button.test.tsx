import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest";
import { Button } from "./button";
import { render, screen } from '@testing-library/react'

describe("Button component", () => {
    it("renders correctly with default text", () => {
        render(<Button>Click Me</Button>)
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
    })

    it("applies variant classes correctly", () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>)
        expect(screen.getByRole("button")).toHaveClass("bg-destructive")

        rerender(<Button variant="outline">Outline</Button>)
        expect(screen.getByRole("button")).toHaveClass("border-input")
    })

})