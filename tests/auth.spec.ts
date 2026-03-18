import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should log in successfully and show inventory', async ({ page }) => {
    // Navigate to login
    await page.goto('http://localhost:5173/login');

    // Fill credentials
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin123');

    // Click Sign In
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for navigation to inventory
    await expect(page).toHaveURL(/.*inventory/);

    // Verify the dashboard content is visible
    await expect(page.getByText(/Inventory Management/i)).toBeVisible();

    // Verify MSW data loaded 
    await expect(page.getByText(/MacBook Pro/i)).toBeVisible();

    // Open the Add Product Modal
    await page.getByRole('button', { name: /add product/i }).click();
    await expect(page.getByRole("heading", { name: /add new product/i })).toBeVisible();

    //Fill the form
    await page.getByLabel(/product name/i).fill('E2E Test Laptop');
    await page.getByLabel(/sku/i).fill('ELEC-001');
    await page.getByLabel(/price/i).fill('1500');
    await page.getByLabel(/stock level/i).fill('10');
    await page.getByLabel(/brand/i).fill('Playwright Brand');
    //Click submit button
    await page.getByRole("button", { name: /submit/i }).click();
    //Check for toast message and product in table
    await expect(page.getByText('Product Created', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('E2E Test Laptop')).toBeVisible();
  });

});