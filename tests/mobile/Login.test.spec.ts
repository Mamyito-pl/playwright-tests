import { test, expect } from '@playwright/test';
import LoginPage from "../../page/Login.page";
import MainLogoutPage from "../../page/MainLogout.page";
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';

test.describe('Testy logowania', async () => {

  let loginPage: LoginPage;
  let mainLogoutPage: MainLogoutPage;

  test.beforeEach(async ({ page }) => {

    await allure.tags("Mobile", "Logowanie")
    await allure.parentSuite("Mobilne");
    await allure.suite("Logowanie");

    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    
    await page.goto('/logowanie', { waitUntil: 'load' });
    await page.waitForTimeout(2000)
    await utility.addGlobalStyles(page);
    })


  test('M | Logowanie z poprawnymi danymi', async ({ page, baseURL }) => {

    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}`);
    expect(mainLogoutPage.getLoginLink).toBeHidden();
  })

  test('M | Logowanie z niepoprawnym emailem', async ({ page, baseURL }) => {
    
    await loginPage.enterEmail('invalidemail@gmail.com');
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    expect(await loginPage.getErrorMessage).toBe("Podany adres email jest nieprawidłowy");
  })

  test('M | Logowanie z niepoprawnym hasłem', async ({ page, baseURL }) => {

    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword('invalidpassword');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    expect(await loginPage.getErrorMessage).toBe("Nieprawidłowe dane logowania");
  })
})

