import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as utility from '../../utils/utility-methods';

test.describe('Testy wydajnościowe', async () => {

  test.setTimeout(300000);

  const TEST_URL = 'https://mamyito.pl';

  async function getPingdomResults(page) {
    await page.goto('https://tools.pingdom.com/');
    await page.fill('#urlInput', TEST_URL);
    await page.click('app-select');
    await page.getByText('Europe - Germany - Frankfurt').click();
    const metricsResponse = await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/metrics') && response.status() === 200,
        { timeout: 120000 }
      ),
      page.getByRole('button', { name: 'Start test' }).click()
    ]);
  
    const metricsJson = await metricsResponse[0].json();
  
    const loadTime = metricsJson.load_time?.current ? `${metricsJson.load_time.current} ms` : undefined;
    const gradeScore = metricsJson.yslow_score?.current;
    const requests = metricsJson.request?.current;
    const size = metricsJson.size?.current ? `${(metricsJson.size.current / 1024 / 1024).toFixed(1)} MB` : undefined;
  
    return { loadTime, requests, gradeScore, size };
  }
  
  async function getPageSpeedResults(page) {
    const performanceScoreMobile = await page.locator('text[class="lh-exp-gauge__percentage"]').first();
    await page.goto('https://pagespeed.web.dev/');
    await page.click('input[inputmode="url"]');
    await page.fill('input[inputmode="url"]', TEST_URL);
    await page.click('button:has-text("Analyze")');
    
    if (await page.getByText('Oops! Something went wrong.').isVisible()) {
      await page.click('button:has-text("Analyze")');
    } else {
      console.log('PageSpeed results are visible');
    }

    await performanceScoreMobile.waitFor({ state: 'visible', timeout: 120000 });

    await utility.removeElementsOnPageSpeed(page);
  
    const performanceScoreMobileScrap = await page.locator('text[class="lh-exp-gauge__percentage"]').first().textContent();
    const LCPscoreMobile = await page.getByText('Largest Contentful Paint (LCP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const INPscoreMobile = await page.getByText('Interaction to Next Paint (INP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const CLSscoreMobile = await page.getByText('Cumulative Layout Shift (CLS)').locator('..').locator('..').locator('div').nth(1).locator('div').nth(0).locator('span > span.f49ZR > span').textContent();
    const FCPscoreMobile = await page.getByText('First Contentful Paint (FCP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const TTFBscoreMobile = await page.getByText('Time to First Byte (TTFB)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
  
    await page.click('#desktop_tab');

    if (await page.getByText('Oops! Something went wrong.').isVisible()) {
      await page.click('button:has-text("Analyze")');
    } else {
      console.log('PageSpeed results are visible');
    }

    const desktopSection = page.locator('div[aria-labelledby="desktop_tab"]');
    const performanceScoreDesktop = await desktopSection.locator('text[class="lh-exp-gauge__percentage"]');
    await performanceScoreDesktop.waitFor({ state: 'visible', timeout: 120000 });

    await utility.removeElementsOnPageSpeed(page);

    const performanceScoreDesktopScrap = await desktopSection.locator('text[class="lh-exp-gauge__percentage"]').textContent();
    const LCPscoreDesktop = await desktopSection.getByText('Largest Contentful Paint (LCP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const INPscoreDesktop = await desktopSection.getByText('Interaction to Next Paint (INP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const CLSscoreDesktop = await desktopSection.getByText('Cumulative Layout Shift (CLS)').locator('..').locator('..').locator('div').nth(1).locator('span span span').last().textContent();
    const FCPscoreDesktop = await desktopSection.getByText('First Contentful Paint (FCP)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
    const TTFBscoreDesktop = await desktopSection.getByText('Time to First Byte (TTFB)').locator('..').locator('..').locator('div').nth(1).locator('span span span').textContent();
  
    return {
      performanceScoreMobileScrap,
      LCPscoreMobile,
      INPscoreMobile,
      CLSscoreMobile,
      FCPscoreMobile,
      TTFBscoreMobile,
      performanceScoreDesktopScrap,
      LCPscoreDesktop,
      INPscoreDesktop,
      CLSscoreDesktop,
      FCPscoreDesktop,
      TTFBscoreDesktop
    };
  }

  test('Pingdom i PageSpeed wyniki', { tag: ['@Performance'] }, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const pingdom = await getPingdomResults(page);
      console.log('Pingdom:', pingdom);
      
      const pageSpeed = await getPageSpeedResults(page);
      console.log('PageSpeed:', pageSpeed);


      const csvPath = 'tests/performance-tests/pageSpeedResults.csv';

      const now = new Date();
      const today = now.toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' });
      const hour = now.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Europe/Warsaw'
      });

      const headers = [
        'Data',
        'Godzina',
        'Load time',
        'Requests',
        'Performance grade',
        'Page size',
        'LCP Desktop',
        'LCP Mobile',
        'INP Desktop',
        'INP Mobile',
        'CLS Desktop',
        'CLS Mobile',
        'FCP Desktop',
        'FCP Mobile',
        'TTFB Desktop',
        'TTFB Mobile',
        'Wydajność Desktop',
        'Wydajność Mobile'
      ];

      const values = [
        today,
        hour,
        pingdom?.loadTime || '',
        pingdom?.requests || '',
        pingdom?.gradeScore || '',
        pingdom?.size || '',
        pageSpeed.LCPscoreDesktop,
        pageSpeed.LCPscoreMobile,
        pageSpeed.INPscoreDesktop,
        pageSpeed.INPscoreMobile,
        pageSpeed.CLSscoreDesktop,
        pageSpeed.CLSscoreMobile,
        pageSpeed.FCPscoreDesktop,
        pageSpeed.FCPscoreMobile,
        pageSpeed.TTFBscoreDesktop,
        pageSpeed.TTFBscoreMobile,
        pageSpeed.performanceScoreDesktopScrap,
        pageSpeed.performanceScoreMobileScrap
      ];
      const row = `\n${values.map(v => `"${v}"`).join(',')}`;
      if (!fs.existsSync(csvPath)) {
        fs.writeFileSync(csvPath, headers.join(',') + row);
      } else {
        fs.appendFileSync(csvPath, row);
      }
      
      await context.close();
    });
})