import { test as setup, expect } from '../fixtures/fixtures.ts';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import CommonPage from '../page/Common.page.ts';
import * as utility from '../utils/utility-methods.ts';

const authFile = 'playwright/.auth/user.json'

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;
let commonPage: CommonPage;

setup('Autoryzacja', async ({ page }) => {

  setup.setTimeout(100000);

  loginPage = new LoginPage(page);
  mainLogoutPage = new MainLogoutPage(page);
  commonPage = new CommonPage(page);

  page.on('framenavigated', async () => {
    await utility.addGlobalStyles(page);
  });

  const response = await page.request.get(`${process.env.URL}`);
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    try {
      const response = await page.goto(`${process.env.URL}` + '/logowanie', { waitUntil: 'domcontentloaded' });
      if (response && response.status() === 200) {
        success = true;
      } else {
        throw new Error(`Otrzymano status ${response?.status()}`);
      }
    } catch (error) {
      if (error.message.includes('503')) {
        await page.waitForTimeout(1000);
        attempt++;
      } else {
        throw error;
      }
    }
  }

  if (!success) {
    throw new Error('Zbyt wiele prób, serwer nadal zwraca 503 lub inny błąd');
  }

  await page.waitForTimeout(2000);
  await loginPage.enterEmail(`${process.env.EMAIL}`);
  await loginPage.enterPassword(`${process.env.PASSWORD}`);
  await expect(loginPage.getLoginButton).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(1000);
  await loginPage.clickLoginButton();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${process.env.URL}`, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');
  await utility.addGlobalStyles(page);
  await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 15000 });
  await expect(mainLogoutPage.getLoginLink).toBeHidden({ timeout: 10000 });
  await expect(response).toBeOK();
  await page.context().storageState({ path: authFile })
});