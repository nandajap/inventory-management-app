export interface Product {
    id: number;
    name: string;
    sku: string;
    stockLevel: number;
    price: number;
    category: string;
    lastUpdated: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}