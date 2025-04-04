import { expect, test as setup } from '@playwright/test';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import * as utility from '../utils/utility-methods.ts';

const authFile = 'playwright/.auth/user.json'

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;

setup('Autoryzacja', async ({ page }) => {

  page.setDefaultTimeout(80000);

  loginPage = new LoginPage(page);
  mainLogoutPage = new MainLogoutPage(page);
  page.on('framenavigated', async () => {
    await utility.addGlobalStyles(page);
  });

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
        console.log(`Otrzymano 503, próba ${attempt + 1} z ${maxRetries}`);
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
  await loginPage.clickLoginButton();
  await page.waitForURL(`${process.env.URL}` + '/logowanie', { waitUntil: 'networkidle', timeout: 20000 });
  await utility.addGlobalStyles(page);
  await expect(mainLogoutPage.getLoginLink).toBeHidden();
  await page.waitForURL(`${process.env.URL}`, { waitUntil: 'commit' });
  await page.context().storageState({ path: authFile })
});