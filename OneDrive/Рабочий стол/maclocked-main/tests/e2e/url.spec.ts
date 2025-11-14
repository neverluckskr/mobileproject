import { test, expect } from '@playwright/test';

test('restores filters from URL params', async ({ page }) => {
  await page.goto('/?class=10A&day=thursday&mode=short');
  await expect(page.locator('#dayFilter')).toHaveValue('thursday');
  await expect(page.locator('[data-active-day]')).not.toBeEmpty();
});

test('renders next lesson card with countdown', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-next-countdown]')).not.toBeEmpty();
});
