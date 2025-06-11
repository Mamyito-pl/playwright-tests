import { test, expect } from '@playwright/test';
import LoginPage from "../../page/Login.page";
import CommonPage from "../../page/Common.page";
import MainLogoutPage from "../../page/MainLogout.page";
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';

test.describe.configure({ mode: 'serial' })

test.describe('Testy logowania', async () => {

  let loginPage: LoginPage;
  let commonPage: CommonPage;
  let mainLogoutPage: MainLogoutPage;

  test.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    commonPage = new CommonPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    
    await utility.gotoWithRetry(page, '/logowanie');
    await page.waitForTimeout(2000);
    await utility.addGlobalStyles(page);
    })

  test.use({ storageState: { cookies: [], origins: [] }})
  test('M | Logowanie z poprawnymi danymi', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Logowanie');
    await allure.epic('Mobilne');
    await allure.parentSuite('Logowanie');
    await allure.suite('Testy logowania');
    await allure.subSuite('');
    await allure.allureId('477');

    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.getLoginButton.waitFor({ state: 'visible', timeout: 5000 });
    await expect(loginPage.getLoginButton).toBeEnabled({ timeout: 5000 });
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}`, { timeout: 15000 });
    expect(mainLogoutPage.getLoginLink).toBeHidden();
  })

  test.use({ storageState: { cookies: [], origins: [] }})
  test('M | Logowanie z niepoprawnym emailem', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Logowanie');
    await allure.epic('Mobilne');
    await allure.parentSuite('Logowanie');
    await allure.suite('Testy logowania');
    await allure.subSuite('');
    await allure.allureId('478');
    
    await loginPage.enterEmail('invalidemail@gmail.com');
    await loginPage.enterPassword(`${process.env.PASSWORD}`);
    await loginPage.getLoginButton.waitFor({ state: 'visible', timeout: 5000 });
    await expect(loginPage.getLoginButton).toBeEnabled({ timeout: 5000 });
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    await expect(commonPage.getMessage).toHaveText("Podany adres email jest nieprawidłowy", { timeout: 15000 });
  })

  test.use({ storageState: { cookies: [], origins: [] }})
  test('M | Logowanie z niepoprawnym hasłem', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Logowanie');
    await allure.epic('Mobilne');
    await allure.parentSuite('Logowanie');
    await allure.suite('Testy logowania');
    await allure.subSuite('');
    await allure.allureId('479');

    await loginPage.enterEmail(`${process.env.EMAIL}`);
    await loginPage.enterPassword('invalidpassword');
    await loginPage.getLoginButton.waitFor({ state: 'visible', timeout: 5000 });
    await expect(loginPage.getLoginButton).toBeEnabled({ timeout: 5000 });
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(`${baseURL}` + '/logowanie');
    await expect(commonPage.getMessage).toHaveText("Nieprawidłowe dane logowania", { timeout: 15000 });
  })
})

