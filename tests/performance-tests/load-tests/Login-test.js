import http from 'k6/http';
import exec from 'k6/execution';
import { browser } from 'k6/browser';
import { sleep, check, fail } from 'k6';

const BASE_URL = 'https://mamyito-front.test.desmart.live/logowanie';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '5s', target: 1 },   // Rozgrzewka do 1 użytkownika
        { duration: '10s', target: 2 },  // Zwiększanie do 3 użytkowników
        { duration: '5s', target: 0 },   // Schładzanie
      ],
      options: {
        browser: {
          type: 'chromium'
        },
      },
    },
  },
  thresholds: {
    checks: ['rate>0.90'],
    browser_web_vital_lcp: ['p(95)<5000'], // LCP poniżej 5 sekund
  },
};

export function setup() {
  let res = http.get(BASE_URL);
  if (res.status !== 200) {
    exec.test.abort(`Got unexpected status code ${res.status} when trying to setup. Exiting.`);
  }
}

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL);

    const loginTitle = await page.locator('[data-sentry-element="FormHeader"]').textContent();
    check(loginTitle, {
      'Login title is visible': (title) => title && title.includes('Zaloguj się'),
    });

    await page.locator('#login_email').fill('danie.lalak@mamyito.pl');
    await page.locator('#login_password').fill('123');

    await page.locator('#login_submit_button').click();

    sleep(10);

    check(loginTitle, {
      'Login title is visible2': (title) => title && title.includes('Zaloguj się'),
    });

    await page.screenshot({ path: 'screenshots/screenshot.png' });

    await page.close();

  } catch (error) {
    fail(`Browser iteration failed: ${error.message}`);
  } finally {
    await page.close();
  }

  sleep(1);
}