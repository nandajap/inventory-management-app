import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Inventory from "./Inventory";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { BASE_URL } from "@/constants/api";
import { productService } from "@/services/productService";
import "@testing-library/jest-dom";


const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

describe("Inventory Page", () => {
    beforeEach(() => {
        queryClient.clear();
        const now = Date.now();
        // Match the format expected by your tokenValidation.ts:
        // parts[parts.length - 1] must be a recent timestamp
        const freshToken = `access-token-admin-${now}`;

        localStorage.setItem('accessToken', freshToken);
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'Admin' }));
    });

    describe("Initial rendering", () => {
        it("renders the inventory table with data from MSW", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <AuthProvider>
                            <Inventory />
                        </AuthProvider>
                    </BrowserRouter>
                </QueryClientProvider>
            );

            // First, wait for the loading state to disappear
            await waitFor(() => {
                expect(screen.queryByText(/Loading products/i)).not.toBeInTheDocument();
            }, { timeout: 5000 });

            // Then look for the data
            const laptopRow = await screen.findByText(/MacBook Pro/i);
            expect(laptopRow).toBeInTheDocument();
        });

    })


    describe("User Interactions", () => {
        it("handles sorting when a column header is clicked", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Find the Sortable header
            const nameHeader = await screen.findByText(/Product Name/i);

            // 2. Click to sort (triggers handleSort)
            await user.click(nameHeader);

            // 3. Verify it shows the loading state for the new sort
            expect(screen.getByText(/Loading page 1/i)).toBeInTheDocument();
        });

        it("triggers the delete mutation when confirmed", async () => {
            const user = userEvent.setup();
            // Mock window.confirm
            const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // Find a delete button in the table (after data loads)
            const deleteButtons = await screen.findAllByRole("button");
            const deleteBtn = deleteButtons.find(btn => btn.innerHTML.includes("trash")); // Finding the Trash2 icon

            if (deleteBtn) {
                await user.click(deleteBtn);
                expect(confirmSpy).toHaveBeenCalled();
            }
            confirmSpy.mockRestore();
        });

        it("opens the Add Product modal on button click", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            const addBtn = await screen.findByRole("button", { name: /Add Product/i });
            await user.click(addBtn);

            // Check if the Modal Title appears
            expect(await screen.findByText(/Add New Product/i)).toBeInTheDocument();
        });

        it("changes page when pagination button is clicked", async () => {
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                <Inventory />
            </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Find the 'Next' button
            const nextButton = await screen.findByRole("button", { name: /next/i });
            await user.click(nextButton);

            // 2. Verify it triggers a fetch for the next page
            expect(await screen.findByText(/Loading page 2/i)).toBeInTheDocument();
        });

        it("shows empty state when no products are returned", async () => {
            // 1. Override the MSW handler
            server.use(
                http.get(`${BASE_URL}/products`, () => {
                    return HttpResponse.json({ data: [], pagination: { totalItems: 0, totalPages: 0, page: 1, pageSize: 10 } });
                })
            );

            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 2. Look for the "No products found" text 
            expect(await screen.findByText(/No products found/i)).toBeInTheDocument();
        });

        it("handles page size changes", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Find the Select by its role. 
            const pageSizeSelect = await screen.findByRole("combobox");
            await user.click(pageSizeSelect);

            // 2. Look for the option '25' in the portal
            const option25 = await screen.findByRole("option", { name: "25" });
            await user.click(option25);

            // 3. Check if it triggered the loading state for page 1
            expect(await screen.findByText(/Loading page 1/i)).toBeInTheDocument();
        });

        it("handles the edit button click", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Find an edit button (Pencil icon)
            const editButtons = await screen.findAllByRole("button");
            const editBtn = editButtons.find(btn => btn.innerHTML.includes("pencil"));

            if (editBtn) {
                await user.click(editBtn);
                expect(await screen.findByText(/Edit Product/i)).toBeInTheDocument();
            }
        });

        it("toggles sort order from asc to desc", async () => {
            const user = userEvent.setup();
            render(<QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider><Inventory /></AuthProvider></BrowserRouter></QueryClientProvider>);

            const nameHeader = await screen.findByText(/Product Name/i);

            // Click once for ASC (default)
            await user.click(nameHeader);
            expect(screen.getByText(/Loading page 1/i)).toBeInTheDocument();

            // Click again for DESC 
            await user.click(nameHeader);

            expect(screen.getByText(/Loading page 1/i)).toBeInTheDocument();
        });

        it("handles delete failure gracefully", async () => {
            const user = userEvent.setup();
            vi.spyOn(window, 'confirm').mockImplementation(() => true);

            const deleteSpy = vi.spyOn(productService, 'delete').mockRejectedValue(new Error("Delete Failed"));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            render(
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <AuthProvider>
                            <Inventory />
                        </AuthProvider>
                    </BrowserRouter>
                </QueryClientProvider>
            );

            // Wait for table and click delete
            const deleteButtons = await screen.findAllByRole("button");
            const deleteBtn = deleteButtons.find(btn => btn.innerHTML.includes("trash"));

            if (deleteBtn) {
                await user.click(deleteBtn);
                await waitFor(() => {
                    expect(consoleSpy).toHaveBeenCalledWith('Delete failed: ', expect.anything());
                });
            }

            // IMPORTANT: Restore the original function so other tests don't fail
            deleteSpy.mockRestore();
            consoleSpy.mockRestore();
        });

        it("hides action columns and add button for Viewer role", async () => {
            // 1. Set user as Viewer
            localStorage.setItem('user', JSON.stringify({ name: 'Viewer User', role: 'Viewer' }));

            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 2. Wait for table
            await screen.findByText(/MacBook Pro/i);

            // 3. Verify "Add Product" button is missing (PermissionGuard check)
            expect(screen.queryByRole("button", { name: /Add Product/i })).not.toBeInTheDocument();

            // 4. Verify "Actions" column header is missing
            expect(screen.queryByText(/Actions/i)).not.toBeInTheDocument();
        });

        it("closes the modal when onClose is triggered", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Open the modal
            const addBtn = await screen.findByRole("button", { name: /Add Product/i });
            await user.click(addBtn);
            expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();

            // 2. Click the Cancel button inside the modal (provided by ProductForm)
            const cancelBtn = screen.getByRole("button", { name: /cancel/i });
            await user.click(cancelBtn);

            // 3. Verify modal is gone 
            await waitFor(() => {
                expect(screen.queryByText(/Add New Product/i)).not.toBeInTheDocument();
            });
        });

        it("opens modal in edit mode with product data", async () => {
            const user = userEvent.setup();
            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            // 1. Wait for data to load
            await screen.findByText(/MacBook Pro/i);

            // 2. Find the edit button specifically by its icon
            const buttons = await screen.findAllByRole("button");
            const editBtn = buttons.find(btn => btn.innerHTML.includes("pencil"));

            if (editBtn) {
                await user.click(editBtn);
                // 3. Find the heading specifically 
                const modalTitle = await screen.findByRole("heading", { name: /Edit Product/i });
                expect(modalTitle).toBeInTheDocument();
                // 4. Verify data is pre-filled
                expect(screen.getByDisplayValue(/MacBook Pro/i)).toBeInTheDocument();
            }
        });

        it("does not delete if user cancels confirmation", async () => {
            const user = userEvent.setup();
            // Mock confirm to return FALSE (Cancel)
            const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false);
            const deleteSpy = vi.spyOn(productService, 'delete');

            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            await screen.findByText(/MacBook Pro/i);
            const deleteButtons = await screen.findAllByRole("button");
            const deleteBtn = deleteButtons.find(btn => btn.innerHTML.includes("trash"));

            if (deleteBtn) {
                await user.click(deleteBtn);
                expect(confirmSpy).toHaveBeenCalled();
                expect(deleteSpy).not.toHaveBeenCalled();
            }
            confirmSpy.mockRestore();
            deleteSpy.mockRestore();
        });

        it("clears selection when edit modal is closed so the next add modal is empty", async () => {
            const user = userEvent.setup();

            render(
                <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider>
                    <Inventory />
                </AuthProvider></BrowserRouter></QueryClientProvider>
            );

            await screen.findByText(/macbook pro/i);

            const editBtn = (await screen.findAllByRole("button")).find(btn => btn.innerHTML.includes("pencil"));

            if (editBtn) {
                await user.click(editBtn);
                expect(await screen.findByRole("heading", {name: /Edit Product/i})).toBeInTheDocument();
            }

            const cancelBtn = screen.getByRole("button", {name:/cancel/i});
            await user.click(cancelBtn);

            const addBtn = screen.getByRole("button", {name:/add product/i});
            await user.click(addBtn);

            expect(await screen.findByRole("heading", {name: /Add new Product/i})).toBeInTheDocument();
            expect(screen.getByLabelText(/product name/i)).toHaveValue("");

        });

    })


});
