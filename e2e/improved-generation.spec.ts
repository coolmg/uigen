import { test, expect } from '@playwright/test';

test('Test improved component generation', async ({ page }) => {
  // Navigate to localhost:3000
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/improved-01-initial.png', fullPage: true });
  
  // Find the message input
  const messageInput = page.getByPlaceholder('Describe the React component you want to create...');
  await expect(messageInput).toBeVisible();
  
  // Test 1: Generate a button component
  await messageInput.fill('Create a modern button component with multiple variants and states');
  await page.keyboard.press('Enter');
  
  // Wait for generation
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'screenshots/improved-02-button-generated.png', fullPage: true });
  
  // Check code view
  const codeTab = page.getByRole('tab', { name: 'Code' });
  if (await codeTab.isVisible()) {
    await codeTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/improved-03-button-code.png', fullPage: true });
  }
  
  // Check preview
  const previewTab = page.getByRole('tab', { name: 'Preview' });
  if (await previewTab.isVisible()) {
    await previewTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/improved-04-button-preview.png', fullPage: true });
  }
  
  // Test 2: Generate a card component
  await messageInput.fill('Create a beautiful card component for a product showcase');
  await page.keyboard.press('Enter');
  
  // Wait for generation
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'screenshots/improved-05-card-generated.png', fullPage: true });
  
  // Check final preview
  if (await previewTab.isVisible()) {
    await previewTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/improved-06-card-final.png', fullPage: true });
  }
});