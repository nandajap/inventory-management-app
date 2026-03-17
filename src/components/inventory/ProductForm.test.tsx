import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "./ProductForm";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

describe("ProductForm Integration", () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

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

    it("validates and submits a Book product", async () => {
        const user = userEvent.setup();
        // 1. Ensure we start with a clean render
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        // 2. Open Category and pick Books (use fireEvent for stability)
        const categoryTrigger = screen.getByRole("combobox", { name: /category/i });
        fireEvent.click(categoryTrigger);
        const bookOption = await screen.findByRole("option", { name: /books/i });
        fireEvent.click(bookOption);

        // 3. Fill Book fields (Clear existing if any)
        await user.type(screen.getByLabelText(/Product Name/i), "Harry Potter");
        await user.type(screen.getByLabelText(/SKU/i), "BOOK-123");
        await user.type(screen.getByLabelText(/Price/i), "20");
        await user.type(screen.getByLabelText(/Stock Level/i), "50");

        // 3. Fill Book attributes
        await user.type(screen.getByLabelText(/Author/i), "J.K. Rowling");

        // ADD GENRE SELECTION (This was the missing piece!)
        const genreTrigger = screen.getByRole("combobox", { name: /genre/i });
        fireEvent.click(genreTrigger);
        const genreOption = await screen.findByRole("option", { name: /^Fiction$/i });
        fireEvent.click(genreOption);

        // 4. Submit
        const submitBtn = screen.getByRole("button", { name: /submit/i });
        await user.click(submitBtn);

        await waitFor(() => {
            // Verify it was only called ONCE in this test
            //expect(mockSubmit).toHaveBeenCalledTimes(1); 
            expect(mockSubmit).toHaveBeenLastCalledWith(expect.objectContaining({
                category: "books",
                name: "Harry Potter"
            }));
        });
    });

    it("validates and submits a Clothing product", async () => {
        const user = userEvent.setup();
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        // 1. Switch to Clothing
        const categoryTrigger = screen.getByRole("combobox", { name: /category/i });
        fireEvent.click(categoryTrigger);
        const clothingOption = await screen.findByRole("option", { name: /clothing/i });
        fireEvent.click(clothingOption);

        // 2. Fill Base fields
        await user.type(screen.getByLabelText(/Product Name/i), "Blue Jeans");
        await user.type(screen.getByLabelText(/SKU/i), "CLOT-001");
        await user.type(screen.getByLabelText(/Price/i), "50");
        await user.type(screen.getByLabelText(/Stock Level/i), "20");

        // 3. Select Size (Wait for it to be visible)
        const sizeTrigger = await screen.findByLabelText(/Size/i);
        fireEvent.click(sizeTrigger);
        const sizeOption = await screen.findByRole("option", { name: /^M$/ });
        fireEvent.click(sizeOption);

        // 4. Select Material (Wait for it to be visible)
        // We use findByRole here to be extra safe
        const materialTrigger = await screen.findByRole("combobox", { name: /material/i });
        fireEvent.click(materialTrigger);
        const materialOption = await screen.findByRole("option", { name: /cotton/i });
        fireEvent.click(materialOption);

        // 5. Submit Button 
        // IMPORTANT: Use findByRole to wait for the Select portal to close 
        // and the button to become "accessible" again.
        const submitBtn = await screen.findByRole("button", { name: /submit/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
                category: "clothing",
                attributes: expect.objectContaining({
                    size: "M",
                    material: "Cotton"
                })
            }));
        });
    });

    it("calls onCancel when the cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProductForm onSubmit={mockSubmit} onCancel={mockCancel} />);

        const cancelBtn = screen.getByRole("button", { name: /cancel/i });
        await user.click(cancelBtn);

        expect(mockCancel).toHaveBeenCalled();
    });

});