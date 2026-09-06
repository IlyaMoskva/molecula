import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const icons = [
  { source: 'public/molecula.svg', output: 'public/pwa-192.png', size: 192 },
  { source: 'public/molecula.svg', output: 'public/pwa-512.png', size: 512 },
  {
    source: 'public/molecula-maskable.svg',
    output: 'public/pwa-maskable-512.png',
    size: 512,
  },
];

await mkdir('public', { recursive: true });
const browser = await chromium.launch();

try {
  for (const icon of icons) {
    const svg = await readFile(icon.source, 'utf8');
    const page = await browser.newPage({
      viewport: { width: icon.size, height: icon.size },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<style>html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}</style>${svg}`,
    );
    await page
      .locator('svg')
      .screenshot({ path: icon.output, omitBackground: true });
    await page.close();
  }
} finally {
  await browser.close();
}
