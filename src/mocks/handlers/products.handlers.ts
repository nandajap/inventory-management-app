import { http, HttpResponse } from 'msw';
import { Product } from "../../types/inventory";
import { validateAuthToken } from '../../utils/tokenValidation';

const BASE_URL = 'https://api.inventoryapp.com';

//Sort options
export type SortField = 'name' | 'sku' | 'stockLevel' | 'price' | 'category' | 'lastUpdated';
export type SortOrder = 'asc' | 'desc';

// Generate 100 mock products
const MOCK_PRODUCTS: Product[] = Array.from({ length: 100 }, (_, i) => {
    const categories = ['Electronics', 'Accessories', 'Furniture', 'Office Supplies'];
    const names = ['Laptop', 'Mouse', 'Cable', 'Monitor', 'Keyboard', 'Webcam', 'Lamp', 'Chair'];

    return {
        id: i + 1,
        name: `${names[i % names.length]} ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(4, '0')}`,
        stockLevel: Math.floor(Math.random() * 200),
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        category: categories[i % categories.length],
        lastUpdated: new Date(2024, 0, 15 - (i % 15)).toISOString().split('T')[0],
    };
});

export const productsHandlers = [
    http.get(`${BASE_URL}/products`, async ({ request }) => {
        console.log('MSW: Intercepted GET /products');

        const authResult = validateAuthToken(request);
        if (!authResult.success) {
            return authResult.response;  // Return 401 if invalid/expired
        }

        console.log('✅ MSW: Valid token, processing request');


        await new Promise(resolve => setTimeout(resolve, 800));
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
        const sortBy = url.searchParams.get('sortBy') as SortField;
        const sortOrder = (url.searchParams.get('sortOrder') || 'asc') as SortOrder;

        //sort products
        let sortedProducts = [...MOCK_PRODUCTS];
        if (sortBy) {
            sortedProducts.sort((a, b) => {
                let comparison = 0;
                if (sortBy === 'price' || sortBy === 'stockLevel') {
                    // Numeric comparison
                    comparison = a[sortBy] - b[sortBy];
                } else {
                    // String comparison
                    const aValue = String(a[sortBy]).toLowerCase();
                    const bValue = String(b[sortBy]).toLowerCase();
                    comparison = aValue.localeCompare(bValue);
                }
                return sortOrder === 'asc' ? comparison : -comparison;
            });
        }

        // Calculate pagination (server-side logic)
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = sortedProducts.slice(startIndex, endIndex);

        console.log(`MSW: Returning ${paginatedData.length} products (page ${page})`);

        return HttpResponse.json({
            data: paginatedData,
            pagination: {
                page,
                pageSize,
                totalItems: MOCK_PRODUCTS.length,
                totalPages: Math.ceil(MOCK_PRODUCTS.length / pageSize),
            },
        });

    }),

    // Delete product
    http.delete(`${BASE_URL}/products/:id`, async ({ params, request }) => {
        const authResult = validateAuthToken(request);
        if (!authResult.success) {
            return authResult.response;
        }
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));

        const id = parseInt(params.id as string);
        const itemIndex = MOCK_PRODUCTS.findIndex(product => product.id === id);

        if (itemIndex === -1) {
            return HttpResponse.json(
                { message: `Product with id ${id} not found` },
                { status: 404 }
            );
        }

        MOCK_PRODUCTS.splice(itemIndex, 1);
        return HttpResponse.json({ message: 'Product deleted successfully' });
    }),
];
