import { describe, it, expect } from 'vitest';
import { productFormSchema } from './product.schema';

describe('productFormSchema', () => {
  const validElectronics = {
    category: 'electronics',
    name: 'Gaming Laptop',
    sku: 'ELEC-123',
    price: '1200.50',
    stockLevel: '10',
    attributes: { brand: 'Razer', warrantyMonths: 24 }
  };

  it('validates a correct electronics product', () => {
    const result = productFormSchema.safeParse(validElectronics);
    expect(result.success).toBe(true);
  });

  describe('Base Field Validations', () => {
    it('fails if name is too short', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, name: 'Ab' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Product name must be at least 3 characters');
      }
    });

    it('fails if SKU format is invalid', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, sku: '123-ELEC' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('SKU must be in format');
      }
    });

    it('fails if price is 0 or negative', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, price: '0' });
      expect(result.success).toBe(false);
    });

    it('fails if stockLevel is not a whole number', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, stockLevel: '10.5' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Must be a whole number');
      }
    });
  });

  describe('Category Specific Validations', () => {
    it('validates a correct clothing product', () => {
      const validClothing = {
        category: 'clothing',
        name: 'Cotton T-Shirt',
        sku: 'CLTH-001',
        price: '25.00',
        stockLevel: '50',
        attributes: { size: 'L', material: 'Cotton' }
      };
      const result = productFormSchema.safeParse(validClothing);
      expect(result.success).toBe(true);
    });

    it('fails if clothing size is invalid', () => {
      const invalidClothing = {
        category: 'clothing',
        name: 'Cotton T-Shirt',
        sku: 'CLTH-001',
        price: '25.00',
        stockLevel: '50',
        attributes: { size: 'SMALL', material: 'Cotton' } 
      };
      const result = productFormSchema.safeParse(invalidClothing);
      expect(result.success).toBe(false);
    });

    it('validates a correct book product', () => {
      const validBook = {
        category: 'books',
        name: 'React Mastery',
        sku: 'BOOK-999',
        price: '45.00',
        stockLevel: '100',
        attributes: { author: 'John Doe', genre: 'Science' }
      };
      const result = productFormSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    it('fails if electronics warranty is not 12, 24, or 36', () => {
      const result = productFormSchema.safeParse({
        ...validElectronics,
        attributes: { brand: 'Razer', warrantyMonths: 6 } // 6 is not allowed
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Case Validations', () => {
    it('fails if stockLevel is a negative number', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, stockLevel: '-5' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Cannot be negative');
      }
    });

    it('fails if stockLevel is not a number string', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, stockLevel: 'abc' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Must be a number');
      }
    });

    it('fails if price is above the maximum limit', () => {
      const result = productFormSchema.safeParse({ ...validElectronics, price: '1000000' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price is too high');
      }
    });

    it('fails if book author is too long', () => {
      const invalidBook = {
        category: 'books',
        name: 'React Mastery',
        sku: 'BOOK-999',
        price: '45.00',
        stockLevel: '100',
        attributes: { 
          author: 'A'.repeat(101), // Over 100 chars
          genre: 'Science' 
        }
      };
      const result = productFormSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Author name is too long');
      }
    });
  });
  
});

