import { z } from "zod";

const productBaseSchema = z.object({
    name: z.string()
        .min(1, 'Product name is required')
        .min(3, 'Product name must be at least 3 characters')
        .max(50, 'Product name must not exceed 50 characters'),

    sku: z.string()
        .min(1, 'SKU is required')
        .regex(/^[A-Z]{4}-\d{3}$/, 'SKU must be in format XXXX-000 (e.g., ELEC-001)'),

     stockLevel: z.string()
        .min(1, 'Stock level is required')
        .refine((val) => !isNaN(Number(val)), 'Must be a number')
        .refine((val) => Number(val) >= 0, 'Cannot be negative')
        .refine((val) => Number.isInteger(Number(val)), 'Must be a whole number'),


   price: z.string()
        .min(1, 'Price is required')
        .max(999999.99, 'Price is too high')
        .refine((val) => !isNaN(Number(val)), 'Must be a valid price')
        .refine((val) => Number(val) > 0, 'Price must be greater than 0'),
});

// Electronics product schema
const electronicsProductSchema = productBaseSchema.extend({
    category: z.literal('electronics'),
    attributes: z.object({
        brand: z.string()
            .min(1, 'Brand is required for electronics'),
        warrantyMonths: z.union([
            z.literal(12),
            z.literal(24),
            z.literal(36)
        ]).refine(val => [12, 24, 36].includes(val), {
            message: 'Warranty must be 12, 24, or 36 months'
        }),
    }),
});

// Clothing product schema
const clothingProductSchema = productBaseSchema.extend({
    category: z.literal('clothing'),
    attributes: z.object({
        size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'], {
            message: 'Please select a valid size'
        }),
        material: z.enum(['Cotton', 'Polyester', 'Wool', 'Silk', 'Blend'], {
            message: 'Please select a valid material'
        }),
    }),
});

// Books product schema
const booksProductSchema = productBaseSchema.extend({
    category: z.literal('books'),
    attributes: z.object({
        author: z.string()
            .min(1, 'Author is required for books')
            .max(100, 'Author name is too long'),
        genre: z.enum(['Fiction', 'Non-Fiction', 'Science', 'History', 'Children', 'Biography'], {
            message: 'Please select a valid genre'
        }),
    }),
});

// Discriminated union schema - matches the Product type
export const productFormSchema = z.discriminatedUnion('category', [
    electronicsProductSchema,
    clothingProductSchema,
    booksProductSchema,
]);

// Type inference from Zod schema (should match ProductFormData)
export type ProductFormInput = z.infer<typeof productFormSchema>;

// TEMPORARY: For learning forms without dynamic fields
export const baseFormSchema = productBaseSchema.extend({
    category: z.enum(['electronics', 'clothing', 'books']),
});
export type BaseFormData = z.infer<typeof baseFormSchema>;


