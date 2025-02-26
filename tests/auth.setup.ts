import { expect, test as setup } from '@playwright/test';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import * as utility from '../utils/utility-methods.ts';

const authFile = 'playwright/.auth/user.json'

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;

setup('Autoryzacja', async ({ page, baseURL }) => {

  loginPage = new LoginPage(page);
  mainLogoutPage = new MainLogoutPage(page);
  
  page.on('framenavigated', async () => {
    await utility.addGlobalStyles(page);
  });
  await page.goto(`${process.env.URL}` + '/logowanie', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await loginPage.enterEmail(`${process.env.EMAIL}`);
  await loginPage.enterPassword(`${process.env.PASSWORD}`);
  await loginPage.clickLoginButton();
  await page.waitForURL(`${process.env.URL}` + '/logowanie', { waitUntil: 'networkidle', timeout: 20000 });
  await utility.addGlobalStyles(page);
  await expect(mainLogoutPage.getLoginLink).toBeHidden();
  await page.waitForURL(`${process.env.URL}`, { waitUntil: 'commit' });
  await page.context().storageState({ path: authFile })
});