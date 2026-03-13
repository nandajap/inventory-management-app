import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from './productService';
import apiClient from './axios';

// We tell Vitest to mock the entire apiClient instance
vi.mock('./axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('productService', () => {
    const mockProduct = { id: 1, name: 'Test Product', price: 100 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetchProducts calls the correct URL with params', async () => {
        // We simulate a successful API response
        vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [mockProduct] } });

        await productService.fetchProducts(1, 10, 'name', 'asc');

        expect(apiClient.get).toHaveBeenCalledWith('/products', {
            params: { page: 1, pageSize: 10, sortBy: 'name', sortOrder: 'asc' }
        });
    });

    it('createProduct calls POST and returns data', async () => {
        const newProductData = { name: 'New', sku: 'ELEC-001', price: '50', stockLevel: '5' };
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockProduct });

        const result = await productService.createProduct(newProductData as any);

        expect(apiClient.post).toHaveBeenCalledWith('/products', newProductData);
        expect(result).toEqual(mockProduct);
    });

    it('updateProduct calls PATCH with the correct ID and data', async () => {
        const updateData = { name: 'Updated Name' };
        const productId = 1;


        vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: productId, ...updateData } });

        await productService.updateProduct(productId, updateData as any);
        expect(apiClient.patch).toHaveBeenCalledWith(`/products/${productId}`, updateData);
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(apiClient.delete).mockRejectedValue(new Error('Network Error'));

        await expect(productService.delete(1)).rejects.toThrow('Network Error');
    });
});