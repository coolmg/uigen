import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/UIGen/);
});

test('shows empty chat state', async ({ page }) => {
  await page.goto('/');

  // Expect the empty state message to be visible
  await expect(page.getByText('Start a conversation to generate React components')).toBeVisible();
});

test('can navigate to auth dialog', async ({ page }) => {
  await page.goto('/');

  // Click on sign in button
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Expect auth dialog to be visible
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Sign In')).toBeVisible();
});