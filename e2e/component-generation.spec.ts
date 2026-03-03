import { test, expect } from '@playwright/test';

test('Generate and analyze basic component', async ({ page }) => {
  // Navigate to localhost:3000
  await page.goto('/');
  
  // Wait for the page to load and take a screenshot first
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/01-initial-state.png', fullPage: true });
  
  // Check if we can see the empty state or find the message input
  const messageInput = page.getByPlaceholder('Describe the React component you want to create...');
  await expect(messageInput).toBeVisible({ timeout: 10000 });
  
  // Generate a basic button component
  await messageInput.fill('Create a simple button component with primary and secondary variants');
  
  // Submit the message
  await page.keyboard.press('Enter');
  
  // Wait for the AI response and component generation
  await page.waitForTimeout(3000); // Give time for AI processing
  
  // Look for signs that a component was generated
  await expect(page.getByText('Creating App.jsx')).toBeVisible({ timeout: 10000 });
  
  // Wait for the component to be created and rendered
  await page.waitForTimeout(5000);
  
  // Take a screenshot after generation
  await page.screenshot({ path: 'screenshots/02-after-generation.png', fullPage: true });
  
  // Check if we can see the code view
  const codeTab = page.getByRole('tab', { name: 'Code' });
  if (await codeTab.isVisible()) {
    await codeTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/03-code-view.png', fullPage: true });
  }
  
  // Check if we can see the preview
  const previewTab = page.getByRole('tab', { name: 'Preview' });
  if (await previewTab.isVisible()) {
    await previewTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/04-preview.png', fullPage: true });
  }
  
  // Try to generate another component to see consistency
  await messageInput.fill('Now create a card component with an image, title, and description');
  await page.keyboard.press('Enter');
  
  // Wait for the second component generation
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshots/05-second-component.png', fullPage: true });
});