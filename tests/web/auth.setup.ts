import { expect, test as setup } from '@playwright/test';
import LoginPage from "../../page/Login.page.ts";
import MainLogoutPage from "../../page/MainLogout.page.ts";
import * as utility from '../../utils/utility-methods';

const authFile = 'playwright/.auth/user.json'

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;

setup('Authenticate', async ({ page }) => {

  loginPage = new LoginPage(page);
  mainLogoutPage = new MainLogoutPage(page);
  
  page.on('framenavigated', async () => {
    await utility.addGlobalStyles(page);
  });
  await page.goto('https://mamyito.pl/logowanie', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await loginPage.enterEmail(`${process.env.EMAIL}`);
  await loginPage.enterPassword(`${process.env.PASSWORD}`);
  await loginPage.clickLoginButton();
  await page.waitForURL('https://mamyito.pl/logowanie', { waitUntil: 'networkidle', timeout: 20000 });
  await utility.addGlobalStyles(page);
  await expect(mainLogoutPage.getLoginLink).toBeHidden();
  await page.waitForURL('https://mamyito.pl/', { waitUntil: 'commit' });
  await page.context().storageState({ path: authFile })
});