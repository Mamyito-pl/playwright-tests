import { expect } from '@playwright/test';
import CommonPage from "../../page/Common.page.ts";
import DeliveryPage from '../../page/Delivery.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';

test.describe.configure({ mode: 'serial'})

test.describe('Testy dostawy', async () => {

  let commonPage: CommonPage;
  let deliveryPage : DeliveryPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await loginManual();

    commonPage = new CommonPage(page);
    deliveryPage = new DeliveryPage(page);
  })
  
  test('M | Okno dostawy otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Mobilne', 'Dostawa');
    await allure.epic('Mobilne');
    await allure.parentSuite('Dostawa');
    await allure.suite('Testy dostawy');
    await allure.subSuite('');
    await allure.allureId('646');

    await page.goto('/dostawa', { waitUntil: 'domcontentloaded' });

    await expect(deliveryPage.getDeliveryAddressTitle).toBeVisible();
    await expect(deliveryPage.getDeliveryAddressSubTitle).toBeVisible();
    await expect(deliveryPage.getAddNewAddressButton).toBeVisible();
    await expect(deliveryPage.getDeliveryInvoiceCheckbox).toBeVisible();
    await expect(deliveryPage.getDeliveryDateTitle).toBeVisible();
  })

  test('M | Możliwość wyboru terminu dostawy', async ({ page }) => {

    await allure.tags('Mobilne', 'Dostawa');
    await allure.epic('Mobilne');
    await allure.parentSuite('Dostawa');
    await allure.suite('Testy dostawy');
    await allure.subSuite('');
    await allure.allureId('647');

    test.setTimeout(150000);

    await page.goto('/dostawa', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('text=Adres Podstawowy', { state: 'visible' });
    await page.getByText('Adres Podstawowy').click({ force: true });

    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 15000, state: 'visible' });

    await deliveryPage.getDeliverySlotButton.first().click();
    await expect(deliveryPage.getDeliverySlotButton.first()).toContainText('Wybrany');
    await deliveryPage.getDeliverySlotButton.last().click();
    await expect(deliveryPage.getDeliverySlotButton.first()).toContainText('Dostępny');
    await expect(deliveryPage.getDeliverySlotButton.last()).toContainText('Wybrany');
  })

  test.describe('Adres dostawy', async () => {
    
    test('M | Możliwość dodania adresu dostawy', async ({ page, deleteAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('648');

      test.setTimeout(100000);
      
      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      await deliveryPage.clickAddNewAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Dodaj nowy adres');

      await expect(deliveryPage.getAddressModalAddressName).toBeVisible();
      await deliveryPage.getAddressModalAddressName.fill('Adres Testowy');

      await expect(deliveryPage.getAddressModalUserName).toBeVisible();
      await deliveryPage.getAddressModalUserName.fill('Jan');

      await expect(deliveryPage.getAddressModalUserSurname).toBeVisible();
      await deliveryPage.getAddressModalUserSurname.fill('Kowalski')

      await expect(deliveryPage.getAddressModalUserPhoneNumber).toBeVisible();
      await deliveryPage.getAddressModalUserPhoneNumber.fill('555666777');

      await expect(deliveryPage.getAddressModalUserPostalCode).toBeVisible();
      await deliveryPage.getAddressModalUserPostalCode.fill('00-133');

      await expect(deliveryPage.getAddressModalUserCity).toBeVisible();
      await deliveryPage.getAddressModalUserCity.fill('Warszawa');

      await expect(deliveryPage.getAddressModalUserStreet).toBeVisible();
      await deliveryPage.getAddressModalUserStreet.fill('aleja Jana Pawła II');

      await expect(deliveryPage.getAddressModalUserHouseNumber).toBeVisible();
      await deliveryPage.getAddressModalUserHouseNumber.fill('20');

      await expect(deliveryPage.getAddressModalUserStaircase).toBeVisible();
      await deliveryPage.getAddressModalUserStaircase.fill('1');

      await expect(deliveryPage.getAddressModalUserFlatNumber).toBeVisible();
      await deliveryPage.getAddressModalUserFlatNumber.fill('30');

      /*await expect(deliveryPage.getAddressModalUserFloor).toBeVisible();
      await deliveryPage.getAddressModalUserFloor.fill('2');
                                                                                        // Uncomment after done task KAN-801
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toBeVisible();
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka');*/

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText("Dane zostały zapisane", { timeout: 5000 })

      await page.waitForSelector('text=Adres Testowy', { state: 'visible' });

      await deleteAddressDelivery('Adres Testowy');
    })

    test('M | Możliwość wyboru adresu dostawy', async ({ page, addAddressDelivery, deleteAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('649');

      test.setTimeout(100000);

      const targetAddress = page.getByText('Adres Podstawowy').locator('..').locator('..').locator('..');
      
      await page.goto('/dostawa', { waitUntil: 'domcontentloaded' });

      await page.waitForSelector('text=Adres Podstawowy', { state: 'visible' });
      await addAddressDelivery('Adres Fixturowy');
      await page.waitForSelector('text=Adres Fixturowy', { state: 'visible' });

      await page.getByText('Adres Podstawowy').click({ force: true });

      await expect(targetAddress).toContainText('Aktualnie wybrany', { timeout: 5000 });

      const borderColor = await targetAddress.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.getPropertyValue('border'); 
      });

      console.log('Kolor obramowania:', borderColor);
      expect(borderColor).toBe('1px solid rgb(78, 180, 40)');

      await page.getByText('Adres Fixturowy').click({ force: true });

      await expect(targetAddress).not.toContainText('Aktualnie wybrany', { timeout: 5000 });
    })

    test('M | Możliwość edycji adresu dostawy', async ({ page }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('650');

      test.setTimeout(100000);

      await page.goto('/dostawa', { waitUntil: 'domcontentloaded' });

      //await page.getByText('Adres Fixturowy').locator('..').locator('..').locator('..').locator('svg').nth(1).click();

      await deliveryPage.clickEditAddressButton('Adres Fixturowy');

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj adres');

      await expect(deliveryPage.getAddressModalAddressName).toHaveValue('Adres Fixturowy')
      await deliveryPage.getAddressModalAddressName.fill('Adres Edytowany');

      await expect(deliveryPage.getAddressModalUserName).toHaveValue('Jan');
      await deliveryPage.getAddressModalUserName.fill('Jan1');

      await expect(deliveryPage.getAddressModalUserSurname).toHaveValue('Kowalski');
      await deliveryPage.getAddressModalUserSurname.fill('Kowalski1');

      await expect(deliveryPage.getAddressModalUserPhoneNumber).toHaveValue('555666777');
      await deliveryPage.getAddressModalUserPhoneNumber.fill('777666555');

      await expect(deliveryPage.getAddressModalUserPostalCode).toHaveValue('00-828');
      await deliveryPage.getAddressModalUserPostalCode.fill('05-506');

      await expect(deliveryPage.getAddressModalUserCity).toHaveValue('Warszawa');
      await deliveryPage.getAddressModalUserCity.fill('Lesznowola');

      await expect(deliveryPage.getAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
      await deliveryPage.getAddressModalUserStreet.fill('Oficerska');

      await expect(deliveryPage.getAddressModalUserHouseNumber).toHaveValue('1');
      await deliveryPage.getAddressModalUserHouseNumber.fill('4');

      await expect(deliveryPage.getAddressModalUserStaircase).toHaveValue('1');
      await deliveryPage.getAddressModalUserStaircase.fill('2');

      await expect(deliveryPage.getAddressModalUserFlatNumber).toHaveValue('30');
      await deliveryPage.getAddressModalUserFlatNumber.fill('3');

      /*await expect(deliveryPage.getAddressModalUserFloor).toHaveValue('x');
      await deliveryPage.getAddressModalUserFloor.fill('4');
                                                                                        // Uncomment after done task KAN-801
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toHaveValue('x');
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Edytowana testowa notatka');*/

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został zaktualizowany.', { timeout: 5000 });

      //await page.getByText('Adres Edytowany').locator('..').locator('..').locator('..').locator('svg').nth(1).click();

      await deliveryPage.clickEditAddressButton('Adres Edytowany');

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj adres');
      await expect(deliveryPage.getAddressModalAddressName).toHaveValue('Adres Edytowany')
      await expect(deliveryPage.getAddressModalUserName).toHaveValue('Jan1');
      await expect(deliveryPage.getAddressModalUserSurname).toHaveValue('Kowalski1');
      await expect(deliveryPage.getAddressModalUserPhoneNumber).toHaveValue('777666555');
      await expect(deliveryPage.getAddressModalUserPostalCode).toHaveValue('05-506');
      await expect(deliveryPage.getAddressModalUserCity).toHaveValue('Lesznowola');
      await expect(deliveryPage.getAddressModalUserStreet).toHaveValue('Oficerska');
      await expect(deliveryPage.getAddressModalUserHouseNumber).toHaveValue('4');
      await expect(deliveryPage.getAddressModalUserStaircase).toHaveValue('2');
      await expect(deliveryPage.getAddressModalUserFlatNumber).toHaveValue('3');
      /*await expect(deliveryPage.getAddressModalUserFloor).toHaveValue('77');
                                                                                        // Uncomment after done task KAN-801
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toHaveValue('88');
      */
    })
    
    test('M | Możliwość usunięcia adresu dostawy', async ({ page }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('651');

      test.setTimeout(50000);

      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      //await page.getByText('Adres Edytowany').locator('..').locator('..').locator('..').locator('svg').nth(2).click();

      await deliveryPage.clickDeleteAddressButton('Adres Edytowany');

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName('Adres Edytowany')).toContainText('Adres Edytowany');
      await expect(deliveryPage.getAddressModalCancelButton).toBeVisible();
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został usunięty.', { timeout: 5000 })

      await page.waitForSelector('text=Adres Edytowany', { state: 'hidden' });
    })
  })

  test.describe('Faktura', async () => {
    
    test('M | Możliwość dodania podmiotu do faktury', async ({ page, deleteInvoiceAddressDelivery }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura');
      await allure.allureId('652');

      test.setTimeout(150000);
      
      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      await deliveryPage.getDeliveryInvoiceCheckbox.isVisible();
      await deliveryPage.getDeliveryInvoiceCheckbox.check();
      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();
      await deliveryPage.getAddNewInvoiceAddressButton.scrollIntoViewIfNeeded();
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Dodaj nowy podmiot');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toBeVisible();
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Testowa nazwa podmiotu');

      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toBeVisible();
      await deliveryPage.getInvoiceAddressModalCompanyName.fill('Testowa nazwa firmy');

      await expect(deliveryPage.getInvoiceAddressModalNIP).toBeVisible();
      await deliveryPage.getInvoiceAddressModalNIP.fill('8140667487')

      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-133');

      await expect(deliveryPage.getInvoiceAddressModalUserCity).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Warszawa');

      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('aleja Jana Pawła II');

      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('10');

      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('12');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 5000 })

      await page.waitForSelector('text=Testowa nazwa podmiotu', { timeout: 10000, state: 'visible' });

      await deleteInvoiceAddressDelivery('Testowa nazwa podmiotu');
    })

    test('M | Możliwość wyboru podmiotu do faktury', async ({ page, addInvoiceAddressDelivery, deleteInvoiceAddressDelivery }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura');
      await allure.allureId('653');

      test.setTimeout(150000);

      const targetAddress = page.getByText('Testowa nazwa podmiotu').locator('..').locator('..').locator('..');
      
      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      await page.waitForSelector('text="Chcę otrzymać F-Vat"', { timeout: 30000, state: 'visible' });

      const isVisible = await deliveryPage.getDeliveryInvoiceCheckbox.isVisible();

      if (isVisible) {
      const isChecked = await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();

      if (!isChecked) {
          await deliveryPage.getDeliveryInvoiceCheckbox.check();
      }}

      await addInvoiceAddressDelivery('Testowa nazwa podmiotu');
      await page.waitForSelector('text=Testowa nazwa podmiotu', { state: 'visible' });
      await addInvoiceAddressDelivery('Fixturowy adres podmiotu');
      await page.waitForSelector('text=Fixturowy adres podmiotu', { state: 'visible' });

      await page.getByText('Testowa nazwa podmiotu').click();

      await expect(targetAddress).toContainText('Aktualnie wybrany', { timeout: 3000 });

      const borderColor = await targetAddress.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.getPropertyValue('border'); 
      });

      console.log('Kolor obramowania:', borderColor);
      expect(borderColor).toBe('1px solid rgb(78, 180, 40)');

      await page.getByText('Fixturowy adres podmiotu').click();

      await expect(targetAddress).not.toContainText('Aktualnie wybrany', { timeout: 3000 });

      await deleteInvoiceAddressDelivery('Testowa nazwa podmiotu');
    })

    test('M | Możliwość edycji podmiotu do faktury', async ({ page }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura');
      await allure.allureId('654');
      
      test.setTimeout(120000);

      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      await deliveryPage.getDeliveryInvoiceCheckbox.isVisible();
      await deliveryPage.getDeliveryInvoiceCheckbox.check();
      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();

      await page.waitForSelector('text=Fixturowy adres podmiotu', { timeout: 5000, state: 'visible' });

      await page.getByText('Fixturowy adres podmiotu').locator('..').locator('..').locator('..').locator('svg').nth(1).click();

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Fixturowy adres podmiotu');
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Edytowana nazwa podmiotu');

      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toHaveValue('Testowa firma');
      await deliveryPage.getInvoiceAddressModalCompanyName.fill('Edytowana nazwa firmy');

      await expect(deliveryPage.getInvoiceAddressModalNIP).toHaveValue('8140667487');
      await deliveryPage.getInvoiceAddressModalNIP.fill('1085179548')

      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-828');
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-100');

      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Warszawa');
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Magdalenka');

      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('Edytowana ulica');

      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('1');
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('100');

      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('30');
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('200');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został zaktualizowany.', { timeout: 5000 })
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 10000 })
      
      await page.waitForSelector('text=Edytowana nazwa podmiotu', { timeout: 5000, state: 'visible' });

      await page.getByText('Edytowana nazwa podmiotu').locator('..').locator('..').locator('..').locator('svg').nth(1).click({ force: true });

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');
      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Edytowana nazwa podmiotu')
      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toHaveValue('Edytowana nazwa firmy');
      await expect(deliveryPage.getInvoiceAddressModalNIP).toHaveValue('1085179548');
      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-100');
      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Magdalenka');
      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('Edytowana ulica');
      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('100');
      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('200');
    })
    
    test('M | Możliwość usunięcia podmiotu do faktury', async ({ page }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura');
      await allure.allureId('655');

      test.setTimeout(120000);
      
      await page.goto('/dostawa', { waitUntil: 'networkidle' });

      await page.getByText('Edytowana nazwa podmiotu').locator('..').locator('..').locator('..').locator('svg').nth(2).click();

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 3000 });
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName('Edytowana nazwa podmiotu')).toContainText('Edytowana nazwa podmiotu');
      await expect(deliveryPage.getAddressModalCancelButton).toBeVisible();
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został usunięty.', { timeout: 5000 })
    })
  })
})