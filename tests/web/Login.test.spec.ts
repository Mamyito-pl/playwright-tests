import { test, expect } from '@playwright/test';
import LoginPage from "../../page/Login.page";
import CommonPage from "../../page/Common.page";
import MainLogoutPage from "../../page/MainLogout.page";
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';

test.describe('Logowanie', async () => {

  test.setTimeout(80000);

  let loginPage: LoginPage;
  let commonPage: CommonPage;
  let mainLogoutPage: MainLogoutPage;

  test.beforeEach(async ({ page }) => {

    await allure.tags("Web", "Logowanie")
    await allure.parentSuite("Webowe");
    await allure.suite('Logowanie') 

    loginPage = new LoginPage(page);
    commonPage = new CommonPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    
    await page.goto('/logowanie', { waitUntil: 'load' });
    await page.waitForTimeout(2000)
    await utility.addGlobalStyles(page);
  })

  test('W | Logowanie z poprawnymi danymi', { tag: ['@Smoke'] }, async ({ page, baseURL }) => {

    await allure.allureId('445')

    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}`);
    expect(mainLogoutPage.getLoginLink).toBeHidden();
  })

  test('W | Logowanie z niepoprawnym emailem', async ({ page, baseURL }) => {

    await allure.allureId('447')

    await loginPage.enterEmail('invalidemail@gmail.com');
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    await expect(commonPage.getMessage).toHaveText("Podany adres email jest nieprawidłowy", { timeout: 5000 })
  })

  test('W | Logowanie z niepoprawnym hasłem', async ({ page, baseURL }) => {

    await allure.allureId('446')
    
    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword('invalidpassword');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    await expect(commonPage.getMessage).toHaveText("Nieprawidłowe dane logowania", { timeout: 5000 })
  })
})

