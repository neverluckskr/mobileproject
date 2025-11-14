const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PLAYWRIGHT LOG', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR', err.stack));
  await page.goto('http://127.0.0.1:5176/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('PAGE TITLE', await page.title());
  console.log('ROOT HTML LENGTH', (await page.content()).length);
  await browser.close();
})();
