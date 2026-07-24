import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.env.RADAR_URL ?? 'http://127.0.0.1:4321';
const targets = ['/', '/upgrade/glamsterdam/', '/impact/users/', '/evidence/'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
const failures = [];
for (const target of targets) {
  const response = await page.goto(`${base}${target}`, { waitUntil: 'networkidle' });
  const check = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    viewport: [window.innerWidth, window.innerHeight],
    pageWidth: document.documentElement.scrollWidth,
  }));
  console.log(JSON.stringify({ target, status: response?.status(), ...check }));
  if (response?.status() !== 200 || !check.h1 || check.overflow || check.viewport[0] !== 390) failures.push({ target, ...check });
  const safe = target === '/' ? 'home' : target.replaceAll('/', '-').replace(/^-|-$/g, '');
  await page.screenshot({ path: `artifacts/qa-mobile-${safe}.png`, fullPage: true });
}
await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
