import apiClient from "./axios";
import { Product, PaginatedResponse } from '../types/inventory';
import { SortField, SortOrder } from '../mocks/handlers/products.handlers';
import { ProductFormData } from "../types/inventory";


const baseURL = '/products';
export const productService = {

    fetchProducts: async (page: number = 1,
        pageSize: number = 10,
        sortBy?: SortField,
        sortOrder: SortOrder = 'asc'): Promise<PaginatedResponse<Product>> => {
        const response = await apiClient.get<PaginatedResponse<Product>>(`${baseURL}`, { params: { page, pageSize, sortBy, sortOrder } });
        return response.data
    },

    //create product
     async create(data: ProductFormData): Promise<Product> {
        const response = await apiClient.post<Product>(`${baseURL}`, data);
        return response.data;
    },

    // Update product
    async update(id: number, data: ProductFormData): Promise<Product> {
        const response = await apiClient.patch<Product>(`${baseURL}/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    },
}