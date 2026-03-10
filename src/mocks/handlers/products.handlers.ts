import { http, HttpResponse } from 'msw';
import { Product, ProductFormData } from "../../types/inventory";
import { validateAuthToken } from '../../utils/tokenValidation';
import { BASE_URL } from "@/constants/api";

//Sort options
export type SortField = 'name' | 'sku' | 'stockLevel' | 'price' | 'category' | 'lastUpdated';
export type SortOrder = 'asc' | 'desc';

// Mock data: 25 products (8 electronics, 9 clothing, 8 books)
// Mix of in-stock and low/out-of-stock for filtering later
const MOCK_PRODUCTS: Product[] = [
    // Electronics (8 items)
    {
        id: 1,
        name: 'MacBook Pro 16',
        sku: 'ELEC-001',
        stockLevel: 15,
        price: 2499.99,
        category: 'electronics',
        lastUpdated: '2024-01-15',
        attributes: { brand: 'Apple', warrantyMonths: 12 }
    },
    {
        id: 2,
        name: 'Dell XPS 13',
        sku: 'ELEC-002',
        stockLevel: 23,
        price: 1299.99,
        category: 'electronics',
        lastUpdated: '2024-01-14',
        attributes: { brand: 'Dell', warrantyMonths: 24 }
    },
    {
        id: 3,
        name: 'Sony WH-1000XM5 Headphones',
        sku: 'ELEC-003',
        stockLevel: 45,
        price: 399.99,
        category: 'electronics',
        lastUpdated: '2024-01-13',
        attributes: { brand: 'Sony', warrantyMonths: 12 }
    },
    {
        id: 4,
        name: 'iPhone 15 Pro',
        sku: 'ELEC-004',
        stockLevel: 0,  // Out of stock
        price: 999.99,
        category: 'electronics',
        lastUpdated: '2024-01-12',
        attributes: { brand: 'Apple', warrantyMonths: 12 }
    },
    {
        id: 5,
        name: 'Samsung Galaxy S24',
        sku: 'ELEC-005',
        stockLevel: 28,
        price: 899.99,
        category: 'electronics',
        lastUpdated: '2024-01-11',
        attributes: { brand: 'Samsung', warrantyMonths: 12 }
    },
    {
        id: 6,
        name: 'LG 27" 4K Monitor',
        sku: 'ELEC-006',
        stockLevel: 12,
        price: 449.99,
        category: 'electronics',
        lastUpdated: '2024-01-10',
        attributes: { brand: 'LG', warrantyMonths: 36 }
    },
    {
        id: 7,
        name: 'Logitech MX Master 3 Mouse',
        sku: 'ELEC-007',
        stockLevel: 67,
        price: 99.99,
        category: 'electronics',
        lastUpdated: '2024-01-09',
        attributes: { brand: 'Logitech', warrantyMonths: 12 }
    },
    {
        id: 8,
        name: 'Bose SoundLink Speaker',
        sku: 'ELEC-008',
        stockLevel: 3,  // Low stock
        price: 129.99,
        category: 'electronics',
        lastUpdated: '2024-01-08',
        attributes: { brand: 'Bose', warrantyMonths: 12 }
    },

    // Clothing (9 items)
    {
        id: 9,
        name: "Levi's 501 Jeans",
        sku: 'CLTH-001',
        stockLevel: 89,
        price: 79.99,
        category: 'clothing',
        lastUpdated: '2024-01-15',
        attributes: { size: 'M', material: 'Cotton' }
    },
    {
        id: 10,
        name: 'Nike Air Max Sneakers',
        sku: 'CLTH-002',
        stockLevel: 45,
        price: 129.99,
        category: 'clothing',
        lastUpdated: '2024-01-14',
        attributes: { size: 'L', material: 'Blend' }
    },
    {
        id: 11,
        name: 'Patagonia Fleece Jacket',
        sku: 'CLTH-003',
        stockLevel: 23,
        price: 199.99,
        category: 'clothing',
        lastUpdated: '2024-01-13',
        attributes: { size: 'L', material: 'Polyester' }
    },
    {
        id: 12,
        name: 'Adidas Cotton Hoodie',
        sku: 'CLTH-004',
        stockLevel: 56,
        price: 59.99,
        category: 'clothing',
        lastUpdated: '2024-01-12',
        attributes: { size: 'M', material: 'Cotton' }
    },
    {
        id: 13,
        name: 'Calvin Klein T-Shirt',
        sku: 'CLTH-005',
        stockLevel: 0,  // Out of stock
        price: 29.99,
        category: 'clothing',
        lastUpdated: '2024-01-11',
        attributes: { size: 'L', material: 'Cotton' }
    },
    {
        id: 14,
        name: 'Cashmere Scarf',
        sku: 'CLTH-006',
        stockLevel: 34,
        price: 149.99,
        category: 'clothing',
        lastUpdated: '2024-01-10',
        attributes: { size: 'S', material: 'Wool' }
    },
    {
        id: 15,
        name: 'North Face Backpack',
        sku: 'CLTH-007',
        stockLevel: 28,
        price: 89.99,
        category: 'clothing',
        lastUpdated: '2024-01-09',
        attributes: { size: 'XL', material: 'Polyester' }
    },
    {
        id: 16,
        name: 'Silk Evening Dress',
        sku: 'CLTH-008',
        stockLevel: 8,
        price: 299.99,
        category: 'clothing',
        lastUpdated: '2024-01-08',
        attributes: { size: 'S', material: 'Silk' }
    },
    {
        id: 17,
        name: 'Under Armour Shorts',
        sku: 'CLTH-009',
        stockLevel: 67,
        price: 39.99,
        category: 'clothing',
        lastUpdated: '2024-01-07',
        attributes: { size: 'M', material: 'Blend' }
    },

    // Books (8 items)
    {
        id: 18,
        name: 'Clean Code',
        sku: 'BOOK-001',
        stockLevel: 45,
        price: 42.99,
        category: 'books',
        lastUpdated: '2024-01-15',
        attributes: { author: 'Robert C. Martin', genre: 'Science' }
    },
    {
        id: 19,
        name: 'The Pragmatic Programmer',
        sku: 'BOOK-002',
        stockLevel: 32,
        price: 39.99,
        category: 'books',
        lastUpdated: '2024-01-14',
        attributes: { author: 'Andrew Hunt', genre: 'Science' }
    },
    {
        id: 20,
        name: 'Atomic Habits',
        sku: 'BOOK-003',
        stockLevel: 78,
        price: 27.99,
        category: 'books',
        lastUpdated: '2024-01-13',
        attributes: { author: 'James Clear', genre: 'Non-Fiction' }
    },
    {
        id: 21,
        name: 'Harry Potter and the Philosopher\'s Stone',
        sku: 'BOOK-004',
        stockLevel: 120,
        price: 24.99,
        category: 'books',
        lastUpdated: '2024-01-12',
        attributes: { author: 'J.K. Rowling', genre: 'Fiction' }
    },
    {
        id: 22,
        name: 'Sapiens',
        sku: 'BOOK-005',
        stockLevel: 0,  // Out of stock
        price: 28.99,
        category: 'books',
        lastUpdated: '2024-01-11',
        attributes: { author: 'Yuval Noah Harari', genre: 'History' }
    },
    {
        id: 23,
        name: 'The Very Hungry Caterpillar',
        sku: 'BOOK-006',
        stockLevel: 95,
        price: 12.99,
        category: 'books',
        lastUpdated: '2024-01-10',
        attributes: { author: 'Eric Carle', genre: 'Children' }
    },
    {
        id: 24,
        name: 'Steve Jobs',
        sku: 'BOOK-007',
        stockLevel: 41,
        price: 34.99,
        category: 'books',
        lastUpdated: '2024-01-09',
        attributes: { author: 'Walter Isaacson', genre: 'Biography' }
    },
    {
        id: 25,
        name: '1984',
        sku: 'BOOK-008',
        stockLevel: 5,  // Low stock
        price: 19.99,
        category: 'books',
        lastUpdated: '2024-01-08',
        attributes: { author: 'George Orwell', genre: 'Fiction' }
    },
];

export const productsHandlers = [
    http.get(`${BASE_URL}/products`, async ({ request }) => {
        try {
            console.log('MSW: Intercepted GET /products');

            const authResult = validateAuthToken(request);
            if (!authResult.success) {
                return authResult.response;  // Return 401 if invalid/expired
            }

            console.log('MSW: Valid token, processing request');
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
        } catch (error) {
            console.error('MSW CRASHED:', error); 
            return new HttpResponse(JSON.stringify({ message: "Internal Mock Error" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    }),

    // POST /products
    http.post(`${BASE_URL}/products`, async ({ request }) => {
        console.log('MSW: Intercepted POST /products');

        const authResult = validateAuthToken(request);
        if (!authResult.success) {
            return authResult.response;
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        const body = await request.json() as ProductFormData;

        const newProduct: Product = {
            id: Math.max(...MOCK_PRODUCTS.map(p => p.id)) + 1,
            ...body,
            lastUpdated: new Date().toISOString().split('T')[0],
        } as Product;

        MOCK_PRODUCTS.unshift(newProduct);

        console.log('MSW: Created product:', newProduct);
        return HttpResponse.json(newProduct, { status: 201 });
    }),

    // PATCH /products/:id
    http.patch(`${BASE_URL}/products/:id`, async ({ params, request }) => {
        console.log('MSW: Intercepted PATCH /products/:id');

        const authResult = validateAuthToken(request);
        if (!authResult.success) {
            return authResult.response;
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        const id = parseInt(params.id as string);
        const updates = await request.json() as Partial<ProductFormData>;

        const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return HttpResponse.json(
                { message: `Product with id ${id} not found` },
                { status: 404 }
            );
        }

        MOCK_PRODUCTS[productIndex] = {
            ...MOCK_PRODUCTS[productIndex],
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0],
        } as Product;

        console.log('MSW: Updated product:', MOCK_PRODUCTS[productIndex]);
        return HttpResponse.json(MOCK_PRODUCTS[productIndex]);
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
