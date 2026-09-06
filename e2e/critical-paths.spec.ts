import { expect, test, type Page } from '@playwright/test';

interface WebAppManifest {
  readonly icons: readonly {
    readonly sizes: string;
    readonly type: string;
    readonly purpose?: string;
  }[];
}

async function addAtom(page: Page, localizedName: string, times = 1) {
  const atom = page.getByRole('button', {
    name: new RegExp(`^${localizedName}.*добавить атом$`),
  });
  for (let click = 0; click < times; click += 1) await atom.click();
}

async function openTraining(page: Page) {
  await page.locator('button:visible', { hasText: 'Тренировка' }).click();
}

test('constructor and training complete the critical water flows', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Собери вещество' }),
  ).toBeVisible();

  await addAtom(page, 'Водород', 2);
  await addAtom(page, 'Кислород');
  await expect(page.getByRole('heading', { name: 'H2O' })).toBeVisible();
  await expect(page.getByText('Вода', { exact: true })).toBeVisible();

  await openTraining(page);
  await expect(
    page.getByRole('heading', { name: 'Соберите воду' }),
  ).toBeVisible();
  await expect(page.getByLabel('H2O')).toHaveCount(0);
  await addAtom(page, 'Кислород');
  await addAtom(page, 'Водород', 2);
  await page.getByRole('button', { name: 'Проверить' }).click();
  await expect(page.getByText('Правильно!')).toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Структура: Вода, H2O' }),
  ).toBeVisible();
});

test('installed application shell reloads and works offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await expect
    .poll(() => page.evaluate(async () => (await caches.keys()).length))
    .toBeGreaterThan(0);

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(
    page.getByRole('heading', { name: 'Собери вещество' }),
  ).toBeVisible();
  await addAtom(page, 'Водород', 2);
  await expect(page.getByText('Водород', { exact: true })).toBeVisible();
  await openTraining(page);
  await expect(
    page.getByRole('heading', { name: 'Соберите воду' }),
  ).toBeVisible();
});

test('critical constructor controls are usable from the keyboard', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'К основному содержимому' });
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeInViewport();

  const hydrogen = page.getByRole('button', {
    name: /^Водород.*добавить атом$/,
  });
  await hydrogen.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  const oxygen = page.getByRole('button', {
    name: /^Кислород.*добавить атом$/,
  });
  await oxygen.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'H2O' })).toBeVisible();
});

test('manifest exposes installable application metadata and icons', async ({
  request,
}) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const manifest = JSON.parse(await response.text()) as WebAppManifest;
  expect(manifest).toMatchObject({
    name: 'Молекула',
    display: 'standalone',
    id: '/',
    lang: 'ru',
    start_url: '/',
    scope: '/',
  });
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
      expect.objectContaining({ sizes: '512x512', purpose: 'any' }),
      expect.objectContaining({ sizes: '512x512', purpose: 'maskable' }),
    ]),
  );

  for (const iconPath of [
    '/pwa-192.png',
    '/pwa-512.png',
    '/pwa-maskable-512.png',
  ]) {
    const iconResponse = await request.get(iconPath);
    expect(iconResponse.ok()).toBeTruthy();
    expect(iconResponse.headers()['content-type']).toContain('image/png');
  }
});
