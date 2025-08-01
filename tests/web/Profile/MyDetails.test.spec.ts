import { expect } from '@playwright/test';
import MyDetailsPage from '../../../page/Profile/MyDetails.page.ts';
import CommonPage from '../../../page/Common.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';
import { faker } from '@faker-js/faker/locale/pl';
import { format } from 'date-fns';

test.setTimeout(80000);

test.describe('Testy moje dane', async () => {

  let myDetailsPage : MyDetailsPage;
  let commonPage : CommonPage;
  let bearerToken: string | null = null;

  test.beforeEach(async ({ page }) => {

    await page.route('**/api/me/update-account', async (route, request) => {
      const headers = request.headers();
      
      const authHeader = headers['authorization'];
  
      if (authHeader && authHeader.startsWith('Bearer ')) {
        bearerToken = authHeader.split(' ')[1];
      }
  
      await route.continue();
    });

    await page.goto('/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    myDetailsPage = new MyDetailsPage(page);
    commonPage = new CommonPage(page);
  })
  
  test('W | Strona moje dane wyświetla się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2005');

    await page.goto('/profil/dane');

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible();
    await expect(myDetailsPage.getNameSurnameLabel).toBeVisible();
    await expect(myDetailsPage.getNameSurnameEditButton).toBeVisible();
    await expect(myDetailsPage.getDateBirthLabel).toBeVisible();
    await expect(myDetailsPage.getDateBirthEditButton).toBeVisible();
    await expect(myDetailsPage.getPhoneNumberLabel).toBeVisible();
    await expect(myDetailsPage.getPhoneNumberEditButton).toBeVisible();
    await expect(myDetailsPage.getEmailLabel).toBeVisible();
    await expect(myDetailsPage.getEmailEditButton).toBeVisible();
    await expect(myDetailsPage.getEmailEditButton).toBeDisabled();
    await expect(myDetailsPage.getPasswordLabel).toBeVisible();
    await expect(myDetailsPage.getPasswordEditButton).toBeVisible();
    await expect(myDetailsPage.getDeleteAccountLabel).toBeVisible();
    await expect(myDetailsPage.getDeleteAccountButton).toBeVisible();
    await expect(myDetailsPage.getNewsletterApprovalLabel).toBeVisible();
    await expect(myDetailsPage.getSMSApprovalLabel).toBeVisible();
  })
    
  test('W | Możliwość zmiany imienia i nazwiska', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2007');

    await page.goto('/profil/dane');

    const exampleName = faker.person.firstName();
    const exampleSurname = faker.person.lastName();

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickNameSurnameEditButton();

    (await myDetailsPage.getModal('Edytuj dane')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();

    await myDetailsPage.getModalNameInput.click();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalNameInput.clear();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalNameInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type(exampleName);
    await expect(myDetailsPage.getModalNameInput).toHaveValue(exampleName);
    await myDetailsPage.getModalSurnameInput.click();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalSurnameInput.clear();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalSurnameInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type(exampleSurname);
    await expect(myDetailsPage.getModalSurnameInput).toHaveValue(exampleSurname);
    await page.waitForTimeout(2000);
    await myDetailsPage.clickModalSaveButton();

    expect (await myDetailsPage.getModal('Edytuj dane')).not.toBeVisible({ timeout: 5000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 15000 });

    await page.waitForTimeout(2000);

    expect(myDetailsPage.getNameSurnameContent).toHaveText(exampleName + ' ' + exampleSurname, { timeout: 15000 });
  })

  /*test.skip('W | Możliwość zmiany daty urodzenia', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('x');

    const exampleDateBirth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const formattedEDB = format(exampleDateBirth, 'yyyy.MM.dd');
    
    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickDateBirthEditButton();

    (await myDetailsPage.getModal('Edytuj datę urodzenia')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();

    await myDetailsPage.clickModalSaveButton();

    expect (await myDetailsPage.getModal('Edytuj datę urodzenia')).not.toBeVisible({ timeout: 5000 });

    const newNameSurnameIsVisible = await myDetailsPage.getDateBirthContent.evaluate((element, { formattedEDB }) => {
        const textContent = element.textContent || '';
        return textContent.includes(formattedEDB);
    },
    { formattedEDB }
    );

    expect(newNameSurnameIsVisible).toBe(true);
  }) UNSKIP AFTER DONE TASK KAN-1202*/

  test('W | Możliwość zmiany numeru telefonu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2009');

    await page.goto('/profil/dane');

    const examplePhoneNumber = (faker.number.int(1) + faker.number.int({ min: 100000000, max: 199999999 })).toString();

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickPhoneNumberEditButton();

    (await myDetailsPage.getModal('Edytuj numer telefonu')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();
    
    await myDetailsPage.getModalPhoneNumberInput.click();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalPhoneNumberInput.clear();
    await page.waitForTimeout(1000);
    await myDetailsPage.getModalPhoneNumberInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type(examplePhoneNumber);
    await page.waitForTimeout(2000);

    await myDetailsPage.clickModalSaveButton();

    expect (await myDetailsPage.getModal('Edytuj numer telefonu')).not.toBeVisible({ timeout: 5000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 15000 });

    await page.waitForTimeout(2000);

    expect(myDetailsPage.getPhoneNumberContent).toHaveText(examplePhoneNumber, { timeout: 15000 });
  })

  test('W | Możliwość zmiany hasła', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2010');

    test.setTimeout(60000);

    await page.goto('/profil/dane');

    const examplePassword = ('Tt-' + faker.number.int({ min: 100000000, max: 199999999 })).toString();

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickPasswordEditButton();

    (await myDetailsPage.getModal('Zmień hasło')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();
    
    await myDetailsPage.getModalCurrentPasswordInput.fill(`${process.env.PASSWORD}`);
    await myDetailsPage.getModalNewPasswordInput.fill(examplePassword);
    await myDetailsPage.getModalNewPasswordConfirmationInput.fill(examplePassword);
    await page.waitForTimeout(1000);

    await myDetailsPage.clickModalSaveButton();

    expect (await myDetailsPage.getModal('Edytuj hasło')).not.toBeVisible({ timeout: 5000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 15000 })

    const postAccountData = await page.request.patch(`${process.env.APIURL}/api/me/update-account`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      data: {
        current_password: examplePassword,
        new_password: `${process.env.PASSWORD}`,
        new_password_confirmation: `${process.env.PASSWORD}`,
      },
    });

    expect(postAccountData.status()).toBe(200);

    expect (await myDetailsPage.getModal('Zmień hasło')).not.toBeVisible({ timeout: 5000 });

    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });
  })

  test('W | Zgoda na komunikację marketingową poprzez newsletter', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, newsletterSignOutViaAPI }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2256');

    await newsletterSignOutViaAPI();

    await page.goto('/profil/dane');

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickNewsletterApprovalSwitch();

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);
  })

  test('W | Zgoda na komunikację marketingową poprzez SMS', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, smsConsentViaAPI }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2257');

    await smsConsentViaAPI(false);

    await page.goto('/profil/dane');

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickSMSApprovalSwitch();

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);
  })
      
  test('W | Wyłączenie zgody na komunikację marketingową poprzez newsletter', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, newsletterSignInViaAPI }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2258');

    await newsletterSignInViaAPI();

    await page.goto('/profil/dane');

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickNewsletterApprovalSwitch();

    (await myDetailsPage.getModal('Zgoda na newsletter')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalConfirmButton).toBeVisible();

    await myDetailsPage.clickModalConfirmButton();

    await page.waitForTimeout(2000);

    expect (await myDetailsPage.getModal('Zgoda na newsletter')).not.toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);
  })

  test('W | Wyłączenie zgody na komunikację marketingową poprzez SMS', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, smsConsentViaAPI }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2259');

    await smsConsentViaAPI(true);

    await page.goto('/profil/dane');

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickSMSApprovalSwitch();

    (await myDetailsPage.getModal('Zgoda na SMS')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalConfirmButton).toBeVisible();

    await myDetailsPage.clickModalConfirmButton();

    await page.waitForTimeout(2000);
    
    expect (await myDetailsPage.getModal('Zgoda na SMS')).not.toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);
  })
})
