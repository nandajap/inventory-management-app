import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "./ProductForm";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("ProductForm Integration", () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    it("shows validation errors when submitting an empty form", async () => {
        const user = userEvent.setup();
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        // 1. Click Submit
        await user.click(screen.getByRole("button", { name: /submit/i }));

        // 2. Expect Zod errors to appear (since names/sku are required)
        expect(await screen.findByText(/Product name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/SKU is required/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("renders dynamic fields when category is changed", async () => {
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        // 1. Open the Category Select
        const categoryTrigger = screen.getByRole("combobox", { name: /category/i });
        fireEvent.click(categoryTrigger);

        // 2. Find and click 'Clothing'
        const clothingOption = await screen.findByRole("option", { name: /clothing/i });
        fireEvent.click(clothingOption);

        // 3. Verify the swap
        await waitFor(() => {
            expect(screen.queryByLabelText(/Brand/i)).not.toBeInTheDocument();
        });

        expect(screen.getByLabelText(/Size/i)).toBeInTheDocument();
    });

    it("submits the form with converted numeric data", async () => {
        const user = userEvent.setup();
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        // 1. Fill base fields
        await user.type(screen.getByLabelText(/Product Name/i), "Test Laptop");
        await user.type(screen.getByLabelText(/SKU/i), "ELEC-999");
        await user.type(screen.getByLabelText(/Price/i), "1200");
        await user.type(screen.getByLabelText(/Stock Level/i), "5");
        await user.type(screen.getByLabelText(/Brand/i), "Apple");

        // 2. Click Submit
        await user.click(screen.getByRole("button", { name: /submit/i }));

        // 3. Check if onSubmit was called in proper format
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
                name: "Test Laptop",
                price: 1200, 
                stockLevel: 5,
                category: "electronics"
            }));
        });
    });
});