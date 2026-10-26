import { expect, test, type Page } from '@playwright/test';

const table = (page: Page) => page.getByRole('treegrid', { name: 'Clients per month' });

test('dashboard loads data from the API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Clients' })).toBeVisible();
  await expect(table(page)).toBeVisible();
});

/** Hovers the chart column of a month, above its axis label. */
async function hoverMonth(page: Page, month: string) {
  const label = page.locator('.recharts-cartesian-axis-tick-value', { hasText: month });
  const box = (await label.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y - 40);
}
const tooltipValue = (page: Page, label: string) =>
  page.locator('.recharts-tooltip-wrapper').locator(`dt:has-text("${label}") + dd`);

test('the chart shows the company by branch, and the selected row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.recharts-surface')).toBeVisible();

  // First month, Feb 2024: the company's 250 clients by branch.
  await hoverMonth(page, 'Feb 2024');
  await expect(tooltipValue(page, 'Branch 1')).toHaveText('147');
  await expect(tooltipValue(page, 'Branch 2')).toHaveText('76');
  await expect(tooltipValue(page, 'Branch 3')).toHaveText('27');
  await expect(tooltipValue(page, 'Total')).toHaveText('250');

  // Selecting Anna in the table shows her clients by channel.
  const row = (name: string) => table(page).getByRole('row', { name: new RegExp(`(^| )${name}$`) });
  await row('Branch 1').getByRole('button', { name: 'Expand' }).click(); // the chevron

  // Branch 1, Aug 2024: reported 214, its advisers add up to 216; the tooltip says so.
  await row('Branch 1').click();
  await hoverMonth(page, 'Aug 2024');
  await expect(tooltipValue(page, 'Total')).toHaveText('214');
  await expect(page.locator('.recharts-tooltip-wrapper')).toContainText(
    'Rows add up to 216, 2 more than 214.',
  );

  await row('Anna Blackwood').click();
  await expect(row('Branch 1')).toHaveAttribute('aria-expanded', 'true'); // selecting kept it open
  await hoverMonth(page, 'Feb 2024');
  await expect(tooltipValue(page, 'Existing clients')).toHaveText('25');
  await expect(tooltipValue(page, 'Total')).toHaveText('25');
});

test('drills down to acquisition channels with the keyboard', async ({ page }) => {
  await page.goto('/');
  // A parent row's name starts with its chevron: "Expand Branch 1".
  const row = (name: string) => table(page).getByRole('row', { name: new RegExp(`(^| )${name}$`) });

  await row('Company').focus();
  await page.keyboard.press('ArrowDown'); // Branch 1
  await page.keyboard.press('ArrowRight'); // expand
  await expect(row('Branch 1')).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('ArrowDown'); // Anna Blackwood
  await page.keyboard.press('ArrowRight'); // expand
  await expect(row('New paid')).toBeVisible();
  await expect(row('New paid')).toHaveAttribute('aria-level', '4');
});
