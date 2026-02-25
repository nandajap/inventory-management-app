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

// Simulate API call with delay
export async function fetchProducts(
    page: number = 1,
    pageSize: number = 10,
    sortBy?: SortField,
    sortOrder: SortOrder = 'asc'
): Promise<PaginatedResponse<Product>> {
    // Log when function is called
    console.log(`API Call: fetchProducts(page=${page}, pageSize=${pageSize}), sort=${sortBy}, order=${sortOrder})`);

    // Simulate 500-1000ms network delay
    await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 500 + 500)
    );

    //Uncomment to test error handling
    //throw new Error('Server connection failed!'); 

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