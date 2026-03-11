interface ProductBase {
    id: number;
    name: string;
    sku: string;
    stockLevel: number;
    price: number;
    lastUpdated: string;
}

// Electronics Product
interface ElectronicsProduct extends ProductBase {
    category: 'electronics';
    attributes: {
        brand: string;
        warrantyMonths: 12 | 24 | 36;
    };
}

// Clothing Product
interface ClothingProduct extends ProductBase {
    category: 'clothing';
    attributes: {
        size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
        material: 'Cotton' | 'Polyester' | 'Wool' | 'Silk' | 'Blend';
    };
}

// Books Product
interface BooksProduct extends ProductBase {
    category: 'books';
    attributes: {
        author: string;
        genre: 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Children' | 'Biography';
    };
}

// Discriminated union 
export type Product = ElectronicsProduct | ClothingProduct | BooksProduct;

// For forms (without id and lastUpdated)
export type ProductFormData = Omit<Product, 'id' | 'lastUpdated'>;

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}