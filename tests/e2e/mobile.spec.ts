import { expect, test, type Locator, type Page } from '@playwright/test';

// Brief: "nothing should break or overflow down to 375px". No mobile design, so the table and the
// chart scroll horizontally inside their cards while the page itself never does.
test.use({ viewport: { width: 375, height: 812 } });

const table = (page: Page) => page.getByRole('treegrid', { name: 'Clients per month' });
// Parent rows are named with their chevron first: "Expand Branch 1".
const row = (page: Page, name: string) =>
  table(page).getByRole('row', { name: new RegExp(`(^| )${name}$`) });

const pageOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function scrollToEnd(scroller: Locator) {
  expect(await scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await scroller.evaluate((el) => (el.scrollLeft = el.scrollWidth));
}

/** Fully visible inside the scroller, not clipped by it. */
async function expectWithin(element: Locator, scroller: Locator) {
  const [box, frame] = await Promise.all([element.boundingBox(), scroller.boundingBox()]);
  expect(box!.x).toBeGreaterThanOrEqual(frame!.x - 1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(frame!.x + frame!.width + 1);
}

test('the page does not overflow, also with every level expanded', async ({ page }) => {
  await page.goto('/');
  await expect(table(page)).toBeVisible();
  expect(await pageOverflow(page)).toBe(0);

  const expand = (name: string) => row(page, name).getByRole('button', { name: 'Expand' }).click();
  await expand('Branch 1');
  await expand('Anna Blackwood');
  await expect(row(page, 'New paid')).toBeVisible();
  expect(await pageOverflow(page)).toBe(0);
});

test('the table scrolls inside its card and keeps the names pinned', async ({ page }) => {
  await page.goto('/');
  const scroller = table(page).locator('..');
  await scrollToEnd(scroller);

  await expectWithin(table(page).getByRole('columnheader').last(), scroller);
  const name = row(page, 'Company').getByRole('rowheader');
  expect((await name.boundingBox())!.x).toBeCloseTo((await scroller.boundingBox())!.x, 0);
});

test('the chart scrolls inside its card to the last month', async ({ page }) => {
  await page.goto('/');
  const scroller = page
    .locator('.recharts-wrapper')
    .locator('xpath=ancestor::div[contains(@class, "scroller")][1]');
  await scrollToEnd(scroller);

  // Scrolled to the end, the plot's right edge (the last month) meets the scroller's right edge.
  const [plot, frame] = await Promise.all([
    scroller.locator('> *').boundingBox(),
    scroller.boundingBox(),
  ]);
  expect(plot!.x + plot!.width).toBeCloseTo(frame!.x + frame!.width, 0);
});
