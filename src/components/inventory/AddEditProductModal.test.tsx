import { render, screen, waitFor } from "@testing-library/react";
import AddEditProductModal from "./AddEditProductModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../../contexts/AuthContext";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { productService } from "@/services/productService";
import { Toaster } from "../ui/toaster";
import "@testing-library/jest-dom";

vi.mock("@/services/productService", () => ({
    productService: {
        createProduct: vi.fn(),
        updateProduct: vi.fn(),
    }
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

describe("AddEditProductModal", () => {
    it("renders with correct title in Add mode", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AddEditProductModal isOpen={true} onClose={vi.fn()} mode="add" />
                </AuthProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AddEditProductModal isOpen={false} onClose={vi.fn()} mode="add" />
                </AuthProvider>
            </QueryClientProvider>
        );
        expect(screen.queryByText(/Add New Product/i)).not.toBeInTheDocument();
    });
    it("calls createProduct and closes on success", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();
        vi.mocked(productService.createProduct).mockResolvedValue({ id: 1 } as any);

        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider><AddEditProductModal isOpen={true} onClose={mockOnClose} mode="add" /></AuthProvider>
            </QueryClientProvider>
        );

        // Fill minimum required and submit
        await user.type(screen.getByLabelText(/Product Name/i), "Test");
        await user.type(screen.getByLabelText(/SKU/i), "TEST-001");
        await user.type(screen.getByLabelText(/Price/i), "10");
        await user.type(screen.getByLabelText(/Stock Level/i), "10");
        await user.type(screen.getByLabelText(/Brand/i), "Brand");

        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("successfully updates an existing product (Edit Mode)", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        const existingProduct = {
            id: 1,
            name: "Old Laptop",
            sku: "ELEC-001",
            price: "1000",
            stockLevel: "10",
            category: "electronics",
            attributes: { brand: "Apple", warrantyMonths: 12 }
        };

        vi.mocked(productService.updateProduct).mockResolvedValue({ id: 1 } as any);

        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AddEditProductModal isOpen={true} onClose={mockOnClose} mode="edit" initialData={existingProduct as any} />
                    <Toaster />
                </AuthProvider>
            </QueryClientProvider>
        );

        // 2. Modify a field
        const nameInput = screen.getByLabelText(/Product Name/i);
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Laptop Name");

        // 3. Submit
        await user.click(screen.getByRole("button", { name: /submit/i }));

        // 4. Wait for success
        await waitFor(() => {
            expect(productService.updateProduct).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        }, { timeout: 3000 });
    });

    it("shows alert when product creation fails", async () => {
        const user = userEvent.setup();
        // 1. Mock a failure
        vi.mocked(productService.createProduct).mockRejectedValue(new Error("API Error"));
        // 2. Spy on window.alert
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AddEditProductModal isOpen={true} onClose={vi.fn()} mode="add" />
                </AuthProvider>
            </QueryClientProvider>
        );

        // Fill minimum and submit
        await user.type(screen.getByLabelText(/Product Name/i), "Error Test");
        await user.type(screen.getByLabelText(/SKU/i), "ERRR-001");
        await user.type(screen.getByLabelText(/Price/i), "10");
        await user.type(screen.getByLabelText(/Stock Level/i), "10");
        await user.type(screen.getByLabelText(/Brand/i), "Brand");

        await user.click(screen.getByRole("button", { name: /submit/i }));

        // 3. Verify the onError logic 
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Error creating product. Check console."));
            expect(consoleSpy).toHaveBeenCalled();
        });

        alertSpy.mockRestore();
        consoleSpy.mockRestore();
    });
});