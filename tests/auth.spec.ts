import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should log in successfully and show inventory', async ({ page }) => {
    // 1. Navigate to login
    await page.goto('http://localhost:5173/login');

    // 2. Fill credentials
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('admin123');

    // 3. Click Sign In
    await page.getByRole('button', { name: /sign in/i }).click();

    // 4. Wait for navigation to inventory
    await expect(page).toHaveURL(/.*inventory/);

    // 5. Verify the dashboard content is visible
    await expect(page.getByText(/Inventory Management/i)).toBeVisible();
    
    // 6. Verify MSW data loaded 
    await expect(page.getByText(/MacBook Pro/i)).toBeVisible();
  });
});