import apiClient from "./axios";
import { Product, PaginatedResponse } from '../types/inventory';
import { SortField, SortOrder } from '../mocks/handlers/products.handlers';


const baseURL = '/products';
export const productService = {

    fetchProducts: async (page: number = 1,
        pageSize: number = 10,
        sortBy?: SortField,
        sortOrder: SortOrder = 'asc'): Promise<PaginatedResponse<Product>> => {
        const response = await apiClient.get<PaginatedResponse<Product>>(`${baseURL}`, { params: { page, pageSize, sortBy, sortOrder } });

        return response.data
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    },
}