export interface Product {
    id: number;
    name: string;
    sku: string;
    stockLevel: number;
    price: number;
    category: string;
    lastUpdated: string;
}

//mock data for testing
const mockProducts: Product[] = [
    { id: 1, name: 'Laptop Pro 15"', sku: 'LPT-001', stockLevel: 45, price: 1299.99, category: 'Electronics', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Wireless Mouse', sku: 'MSE-002', stockLevel: 120, price: 29.99, category: 'Accessories', lastUpdated: '2024-01-14' },
    { id: 3, name: 'USB-C Cable', sku: 'CBL-003', stockLevel: 8, price: 12.99, category: 'Accessories', lastUpdated: '2024-01-13' },
    { id: 4, name: 'Monitor 27"', sku: 'MON-004', stockLevel: 32, price: 349.99, category: 'Electronics', lastUpdated: '2024-01-12' },
    { id: 5, name: 'Keyboard Mechanical', sku: 'KBD-005', stockLevel: 67, price: 89.99, category: 'Accessories', lastUpdated: '2024-01-11' },
    { id: 6, name: 'Webcam HD', sku: 'CAM-006', stockLevel: 15, price: 79.99, category: 'Electronics', lastUpdated: '2024-01-10' },
    { id: 7, name: 'Desk Lamp LED', sku: 'LMP-007', stockLevel: 3, price: 34.99, category: 'Furniture', lastUpdated: '2024-01-09' },
    { id: 8, name: 'Office Chair', sku: 'CHR-008', stockLevel: 22, price: 199.99, category: 'Furniture', lastUpdated: '2024-01-08' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Simulate delay

// Simulate API call with delay
export async function fetchProducts() {
    //throw new Error('Server connection failed!'); testing error case
    // Simulate 500-1000ms network delay
    await delay(Math.random() * 500 + 500);
    return [...mockProducts];
}