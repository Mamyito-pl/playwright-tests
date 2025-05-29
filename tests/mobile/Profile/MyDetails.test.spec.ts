import { expect } from '@playwright/test';
import MyDetailsPage from '../../../page/Profile/MyDetails.page.ts';
import CommonPage from '../../../page/Common.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods';
import { faker } from '@faker-js/faker/locale/pl';
import { format } from 'date-fns';

test.describe('Testy moje dane', async () => {

  let myDetailsPage : MyDetailsPage;
  let commonPage : CommonPage;
  let bearerToken : string;

  test.beforeEach(async ({ page }) => {

    await page.route('**/api/addresses/delivery', async (route, request) => {
      const headers = request.headers();
      
      const authHeader = headers['authorization'];
  
      if (authHeader && authHeader.startsWith('Bearer ')) {
        bearerToken = authHeader.split(' ')[1];
      }
  
      await route.continue();
    });

    await page.goto('/', { waitUntil: 'commit'})

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    myDetailsPage = new MyDetailsPage(page);
    commonPage = new CommonPage(page);
  })
  
  test('M | Strona moje dane wyświetla się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2006');
    
    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

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
  
  test('M | Możliwość zmiany imienia i nazwiska', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2011');

    const exampleName = faker.person.firstName();
    const exampleSurname = faker.person.lastName();
    
    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickNameSurnameEditButton();

    (await myDetailsPage.getModal('Edytuj dane')).isVisible({ timeout: 5000 })
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();

    await myDetailsPage.getModalNameInput.fill(exampleName);
    await myDetailsPage.getModalSurnameInput.fill(exampleSurname);
    await page.waitForTimeout(1000);

    await myDetailsPage.clickModalSaveButton();

    await page.waitForTimeout(2000);
    expect (await myDetailsPage.getModal('Edytuj dane')).not.toBeVisible({ timeout: 10000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 10000 })

    const newNameSurnameIsVisible = await myDetailsPage.getNameSurnameContent.evaluate((element, { exampleName, exampleSurname}) => {
        const textContent = element.textContent || '';
        return textContent.includes(exampleName + ' ' + exampleSurname);
    },
    { exampleName, exampleSurname}
    );

    expect(newNameSurnameIsVisible).toBe(true);
  })
  
  /*test.skip('M | Możliwość zmiany daty urodzenia', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('x');

    const exampleDateBirth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const formattedEDB = format(exampleDateBirth, 'yyyy.MM.dd');
    
    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickDateBirthEditButton();

    (await myDetailsPage.getModal('Edytuj datę urodzenia')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();
    await page.waitForTimeout(1000);

    await myDetailsPage.clickModalSaveButton();

    await page.waitForTimeout(2000);
    expect (await myDetailsPage.getModal('Edytuj datę urodzenia')).not.toBeVisible({ timeout: 10000 });

    const newNameSurnameIsVisible = await myDetailsPage.getDateBirthContent.evaluate((element, { formattedEDB }) => {
        const textContent = element.textContent || '';
        return textContent.includes(formattedEDB);
    },
    { formattedEDB }
    );

    expect(newNameSurnameIsVisible).toBe(true);
  }) UNSKIP AFTER DONE TASK KAN-1202*/

  test('M | Możliwość zmiany numeru telefonu', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2013');

    const examplePhoneNumber = (faker.number.int(1) + faker.number.int({ min: 100000000, max: 199999999 })).toString();

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickPhoneNumberEditButton();

    (await myDetailsPage.getModal('Edytuj numer telefonu')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();
    
    await myDetailsPage.getModalPhoneNumberInput.clear();
    await myDetailsPage.getModalPhoneNumberInput.fill(examplePhoneNumber);
    await page.waitForTimeout(2000);

    await myDetailsPage.clickModalSaveButton();

    await page.waitForTimeout(2000);
    expect (await myDetailsPage.getModal('Edytuj numer telefonu')).not.toBeVisible({ timeout: 10000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 5000 });

    const newNameSurnameIsVisible = await myDetailsPage.getPhoneNumberContent.evaluate((element, { examplePhoneNumber }) => {
        const textContent = element.textContent || '';
        return textContent.includes(examplePhoneNumber);
    },
    { examplePhoneNumber }
    );

    expect(newNameSurnameIsVisible).toBe(true);
  })

  test('M | Możliwość zmiany hasła', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2014');

    const examplePassword = ('Tt-' + faker.number.int({ min: 100000000, max: 199999999 })).toString();

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.clickPasswordEditButton();

    (await myDetailsPage.getModal('Zmień hasło')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalSaveButton).toBeVisible();
    
    await myDetailsPage.getModalCurrentPasswordInput.fill(`${process.env.PASSWORD}`);
    await myDetailsPage.getModalNewPasswordInput.fill(examplePassword);
    await myDetailsPage.getModalNewPasswordConfirmationInput.fill(examplePassword);
    await page.waitForTimeout(1000);

    await myDetailsPage.clickModalSaveButton();

    await page.waitForTimeout(2000);
    expect (await myDetailsPage.getModal('Edytuj hasło')).not.toBeVisible({ timeout: 10000 });
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 10000 })

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

    expect (await myDetailsPage.getModal('Zmień hasło')).not.toBeVisible({ timeout: 10000 });

    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano zmiany', { timeout: 5000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 10000 });
  })
  
  test('M | Zgoda na komunikację marketingową poprzez newsletter', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2260');

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.getNewsletterApprovalLabel.scrollIntoViewIfNeeded();

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickNewsletterApprovalSwitch();

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);
  })

  test('M | Zgoda na komunikację marketingową poprzez SMS', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2261');

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.getSMSApprovalLabel.scrollIntoViewIfNeeded();

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickSMSApprovalSwitch();

    await expect(page.locator('div[data-sentry-component="UserSMSConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);
  })
    
  test('M | Wyłączenie zgody na komunikację marketingową poprzez newsletter', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2262');

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.getNewsletterApprovalLabel.scrollIntoViewIfNeeded();

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).toHaveAttribute('class', /.*Mui-checked.*/);

    await myDetailsPage.clickNewsletterApprovalSwitch();

    (await myDetailsPage.getModal('Zgoda na newsletter')).isVisible({ timeout: 5000 });
    await expect (myDetailsPage.getModalConfirmButton).toBeVisible();

    await myDetailsPage.clickModalConfirmButton();

    await page.waitForTimeout(2000);

    expect (await myDetailsPage.getModal('Zgoda na newsletter')).not.toBeVisible({ timeout: 10000 });

    await expect(page.locator('div[data-sentry-component="UserNewsletterConsent"] span[data-sentry-element="Switch"]')).not.toHaveAttribute('class', /.*Mui-checked.*/);
  })

  test('M | Wyłączenie zgody na komunikację marketingową poprzez SMS', async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy moje dane');
    await allure.subSuite('');
    await allure.allureId('2263');

    await page.goto('profil/moje-dane', { waitUntil: 'domcontentloaded' });

    await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });

    await myDetailsPage.getSMSApprovalLabel.scrollIntoViewIfNeeded();

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
