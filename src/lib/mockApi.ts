export interface Product {
    id: number;
    name: string;
    sku: string;
    stockLevel: number;
    price: number;
    category: string;
    lastUpdated: string;
}

// Paginated Response Interface
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

// Generate 100 mock products (expanded from your 8)
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

// Simulate API call with delay
export async function fetchProducts(
    page: number = 1,
    pageSize: number = 10
): Promise<PaginatedResponse<Product>> {
    // Log when function is called
    console.log(`API Call: fetchProducts(page=${page}, pageSize=${pageSize})`);

    // Simulate 500-1000ms network delay
    await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 500 + 500)
    );

    //Uncomment to test error handling
    //throw new Error('Server connection failed!'); 

    // Calculate pagination (server-side logic)
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = MOCK_PRODUCTS.slice(startIndex, endIndex);

    console.log(`Returning ${paginatedData.length} products (${startIndex}-${endIndex - 1})`);

    // Return paginated response
    return {
        data: paginatedData,
        pagination: {
            page,
            pageSize,
            totalItems: MOCK_PRODUCTS.length,
            totalPages: Math.ceil(MOCK_PRODUCTS.length / pageSize),
        },
    };
}