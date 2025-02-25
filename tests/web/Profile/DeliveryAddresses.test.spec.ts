import { expect } from '@playwright/test';
import CommonPage from "../../../page/Common.page.ts";
import DeliveryAddressesPage from '../../../page/Profile/DeliveryAddresses.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy adresy dostaw', async () => {

  let commonPage: CommonPage;
  let deliveryAddressesPage : DeliveryAddressesPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'commit'})

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
    
    await utility.addGlobalStyles(page);

    commonPage = new CommonPage(page);
    deliveryAddressesPage = new DeliveryAddressesPage(page);
  })
  
  test('W | Strona adresy dostaw pojawia się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('919');
    

    await page.goto('profil/adresy-dostaw', { waitUntil: 'domcontentloaded' });

    await expect(deliveryAddressesPage.getDeliveryAdressesTitle).toBeVisible();
    await expect(deliveryAddressesPage.getAddNewAddressButton).toBeVisible();
  })

  test('W | Możliwość dodania adresu dostawy', async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('920');

    test.setTimeout(150000);
    
    await page.goto('profil/adresy-dostaw', { waitUntil: 'networkidle' });

    await deliveryAddressesPage.clickAddNewAddressButton();
    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Dodaj nowy adres');

    await expect(deliveryAddressesPage.getAddressModalAddressName).toBeVisible();
    await deliveryAddressesPage.getAddressModalAddressName.fill('Adres Testowy');

    await expect(deliveryAddressesPage.getAddressModalUserName).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserName.fill('Jan');

    await expect(deliveryAddressesPage.getAddressModalUserSurname).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserSurname.fill('Kowalski')

    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserPhoneNumber.fill('555666777');

    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserPostalCode.fill('00-133');

    await expect(deliveryAddressesPage.getAddressModalUserCity).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserCity.fill('Warszawa');

    await expect(deliveryAddressesPage.getAddressModalUserStreet).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserStreet.fill('aleja Jana Pawła II');

    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserHouseNumber.fill('20');

    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserStaircase.fill('1');

    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserFlatNumber.fill('30');

    /*await expect(deliveryAddressesPage.getAddressModalUserFloor).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserFloor.fill('2');
                                                                                      // Uncomment after done task KAN-801
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka');*/

    await expect(deliveryAddressesPage.getAddressModalSaveButton).toBeVisible();
    await deliveryAddressesPage.clickSaveAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 5000 })

    await page.waitForSelector('text=Adres Testowy', { state: 'visible' });
    
    await page.getByText('Adres Testowy').locator('..').locator('..').locator('div').locator('div').locator('svg[class="tabler-icon tabler-icon-trash"]').click();

    await page.waitForSelector('div[class*="sc-f8f81ad2-1"]', { state: 'visible', timeout: 10000 });
    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
    await expect(deliveryAddressesPage.getAddressModalDeleteAddressName('Adres Testowy')).toContainText('Adres Testowy');
    await expect(deliveryAddressesPage.getAddressModalConfirmationButton).toBeVisible();
    await deliveryAddressesPage.getAddressModalConfirmationButton.click();
    await deliveryAddressesPage.getAddressModal.waitFor({ state: 'hidden', timeout: 5000 });
    await commonPage.getMessage.getByText('Adres "Adres Testowy" został usunięty.').waitFor({ state: 'hidden', timeout: 10000 });

    await page.getByText('Adres Testowy').isHidden({ timeout: 10000 });
  })

  test('W | Możliwość ustawienia głównego adresu dostawy', async ({ page, addAddressDelivery }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('921');

    test.setTimeout(120000);
    
    await page.goto('profil/adresy-dostaw', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('text=Adres Podstawowy', { state: 'visible' });
    await addAddressDelivery('Adres Fixturowy');
    await page.waitForSelector('text=Adres Fixturowy', { state: 'visible' });

    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.check();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isChecked();
    await deliveryAddressesPage.clickSaveAdressModalButton();
    await deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy').isVisible();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy')).toHaveText('Główny');
    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');
    await deliveryAddressesPage.getCurrentMainAddressModalInfo.isVisible();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isHidden();
    await deliveryAddressesPage.clickCancelAdressModalButton();

    await deliveryAddressesPage.clickEditAddressButton('Adres Podstawowy');
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.check();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isChecked();
    await deliveryAddressesPage.clickSaveAdressModalButton();
    await deliveryAddressesPage.getMainAddressInfo('Adres Podstawowy').isVisible();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Podstawowy')).toHaveText('Główny');
    await deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy').isHidden();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy')).not.toBeAttached();
  })

  test('W | Możliwość edycji adresu dostawy', async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('922');

    test.setTimeout(100000);

    await page.goto('profil/adresy-dostaw', { waitUntil: 'domcontentloaded' });

    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Edytuj adres');

    await expect(deliveryAddressesPage.getAddressModalAddressName).toHaveValue('Adres Fixturowy')
    await deliveryAddressesPage.getAddressModalAddressName.fill('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModalUserName).toHaveValue('Jan');
    await deliveryAddressesPage.getAddressModalUserName.fill('Jan1');

    await expect(deliveryAddressesPage.getAddressModalUserSurname).toHaveValue('Kowalski');
    await deliveryAddressesPage.getAddressModalUserSurname.fill('Kowalski1');

    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toHaveValue('555666777');
    await deliveryAddressesPage.getAddressModalUserPhoneNumber.fill('777666555');

    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toHaveValue('00-828');
    await deliveryAddressesPage.getAddressModalUserPostalCode.fill('05-506');

    await expect(deliveryAddressesPage.getAddressModalUserCity).toHaveValue('Warszawa');
    await deliveryAddressesPage.getAddressModalUserCity.fill('Lesznowola');

    await expect(deliveryAddressesPage.getAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
    await deliveryAddressesPage.getAddressModalUserStreet.fill('Oficerska');

    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toHaveValue('1');
    await deliveryAddressesPage.getAddressModalUserHouseNumber.fill('4');

    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toHaveValue('1');
    await deliveryAddressesPage.getAddressModalUserStaircase.fill('2');

    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toHaveValue('30');
    await deliveryAddressesPage.getAddressModalUserFlatNumber.fill('3');

    /*await expect(deliveryAddressesPage.getAddressModalUserFloor).toHaveValue('x');
    await deliveryAddressesPage.getAddressModalUserFloor.fill('4');
                                                                                      // Uncomment after done task KAN-801
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toHaveValue('x');
    await deliveryAddressesPage.getAddressModalUserDeliveryNotes.fill('Edytowana testowa notatka');*/

    await expect(deliveryAddressesPage.getAddressModalSaveButton).toBeVisible();
    await deliveryAddressesPage.clickSaveAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został zaktualizowany.', { timeout: 5000 });

    await deliveryAddressesPage.clickEditAddressButton('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Edytuj adres');
    await expect(deliveryAddressesPage.getAddressModalAddressName).toHaveValue('Adres Edytowany')
    await expect(deliveryAddressesPage.getAddressModalUserName).toHaveValue('Jan1');
    await expect(deliveryAddressesPage.getAddressModalUserSurname).toHaveValue('Kowalski1');
    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toHaveValue('777666555');
    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toHaveValue('05-506');
    await expect(deliveryAddressesPage.getAddressModalUserCity).toHaveValue('Lesznowola');
    await expect(deliveryAddressesPage.getAddressModalUserStreet).toHaveValue('Oficerska');
    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toHaveValue('4');
    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toHaveValue('2');
    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toHaveValue('3');
    /*await expect(deliveryAddressesPage.getAddressModalUserFloor).toHaveValue('77');
                                                                                      // Uncomment after done task KAN-801
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toHaveValue('88');
    */
  })
  
  test('W | Możliwość usunięcia adresu dostawy', async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('923');

    test.setTimeout(150000);

    await page.goto('profil/adresy-dostaw', { waitUntil: 'networkidle' });

    await deliveryAddressesPage.clickDeleteAddressButton('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
    await expect(deliveryAddressesPage.getAddressModalDeleteAddressName('Adres Edytowany')).toContainText('Adres Edytowany');
    await expect(deliveryAddressesPage.getAddressModalCancelButton).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModalConfirmationButton).toBeVisible();
    await deliveryAddressesPage.getAddressModalConfirmationButton.click();
    await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został usunięty.', { timeout: 5000 })

    await page.waitForSelector('text=Adres Edytowany', { state: 'hidden' });
  })
})
