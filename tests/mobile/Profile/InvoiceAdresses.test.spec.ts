import { expect } from '@playwright/test';
import CommonPage from "../../../page/Common.page.ts";
import InvoiceAddressesPage from '../../../page/Profile/InvoiceAddresses.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy dane do faktury', async () => {

  let commonPage: CommonPage;
  let invoiceAddressesPage : InvoiceAddressesPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    commonPage = new CommonPage(page);
    invoiceAddressesPage = new InvoiceAddressesPage(page);
  })
  
  test('M | Strona dane do faktury otwiera się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy dane do faktury');
    await allure.subSuite('');
    await allure.allureId('1478');

    await page.goto('profil/dane-faktury', { waitUntil: 'domcontentloaded' });

    await expect(invoiceAddressesPage.getInvoiceAddressTitle).toBeVisible();
    await expect(invoiceAddressesPage.getAddNewInvoiceAddressButton).toBeVisible();
  })
  
  test('M | Możliwość dodania danych do faktury', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy dane do faktury');
    await allure.subSuite('');
    await allure.allureId('1479');

    test.setTimeout(100000);
    
    await page.goto('profil/dane-faktury', { waitUntil: 'domcontentloaded' });

    await invoiceAddressesPage.getInvoiceAddressTitle.waitFor({ state: 'visible', timeout: 10000 })

    await invoiceAddressesPage.clickAddNewInvoiceAddressButton();
    await expect(invoiceAddressesPage.getInvoiceAddressModal).toBeVisible();
    await expect(invoiceAddressesPage.getInvoiceAddressModal).toContainText('Dodaj nowy podmiot');

    await expect(invoiceAddressesPage.getInvoiceAddressModalAddressName).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalAddressName.fill('Testowa nazwa podmiotu');

    await expect(invoiceAddressesPage.getInvoiceAddressModalCompanyName).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalCompanyName.fill('Testowa nazwa firmy');

    await expect(invoiceAddressesPage.getInvoiceAddressModalNIP).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalNIP.fill('8140667487')

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserPostalCode).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalUserPostalCode.fill('00-133');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserCity).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalUserCity.fill('Warszawa');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserStreet).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalUserStreet.fill('aleja Jana Pawła II');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserHouseNumber).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalUserHouseNumber.fill('10');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserFlatNumber).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalUserFlatNumber.fill('12');

    await expect(invoiceAddressesPage.getInvoiceAddressModalSaveButton).toBeVisible();
    await invoiceAddressesPage.clickSaveInvoiceAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 15000 })

    await page.waitForSelector('text=Testowa nazwa podmiotu', { timeout: 10000, state: 'visible' });
  })
    
  test('M | Możliwość edycji danych do faktury', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addInvoiceAddressViaAPI }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy dane do faktury');
    await allure.subSuite('');
    await allure.allureId('1480');

    test.setTimeout(120000);

    await addInvoiceAddressViaAPI('Fixturowy adres podmiotu');

    await page.waitForTimeout(3000);

    await page.goto('profil/dane-faktury', { waitUntil: 'domcontentloaded' });

    await invoiceAddressesPage.getInvoiceAddressTitle.waitFor({ state: 'visible', timeout: 10000 });

    await page.waitForSelector('text=Fixturowy adres podmiotu', { timeout: 5000, state: 'visible' });

    await invoiceAddressesPage.clickEditInvoiceAddressButton('Fixturowy adres podmiotu');

    await expect(invoiceAddressesPage.getInvoiceAddressModal).toBeVisible();
    await expect(invoiceAddressesPage.getInvoiceAddressModal).toContainText('Edytuj podmiot');

    await expect(invoiceAddressesPage.getInvoiceAddressModalAddressName).toHaveValue('Fixturowy adres podmiotu');
    await invoiceAddressesPage.getInvoiceAddressModalAddressName.fill('Edytowana nazwa podmiotu');

    await expect(invoiceAddressesPage.getInvoiceAddressModalCompanyName).toHaveValue('Testowa firma');
    await invoiceAddressesPage.getInvoiceAddressModalCompanyName.fill('Edytowana nazwa firmy');

    await expect(invoiceAddressesPage.getInvoiceAddressModalNIP).toHaveValue('8140667487');
    await invoiceAddressesPage.getInvoiceAddressModalNIP.fill('1085179548')

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-828');
    await invoiceAddressesPage.getInvoiceAddressModalUserPostalCode.fill('00-100');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserCity).toHaveValue('Warszawa');
    await invoiceAddressesPage.getInvoiceAddressModalUserCity.fill('Magdalenka');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
    await invoiceAddressesPage.getInvoiceAddressModalUserStreet.fill('Edytowana ulica');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('1');
    await invoiceAddressesPage.getInvoiceAddressModalUserHouseNumber.fill('100');

    await expect(invoiceAddressesPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('30');
    await invoiceAddressesPage.getInvoiceAddressModalUserFlatNumber.fill('200');

    await expect(invoiceAddressesPage.getInvoiceAddressModalSaveButton).toBeVisible();
    await invoiceAddressesPage.clickSaveInvoiceAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został zaktualizowany.', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });
    
    await page.waitForSelector('text=Edytowana nazwa podmiotu', { timeout: 5000, state: 'visible' });

    await invoiceAddressesPage.clickEditInvoiceAddressButton('Edytowana nazwa podmiotu');

    await expect(invoiceAddressesPage.getInvoiceAddressModal).toBeVisible();
    await expect(invoiceAddressesPage.getInvoiceAddressModal).toContainText('Edytuj podmiot');
    await expect(invoiceAddressesPage.getInvoiceAddressModalAddressName).toHaveValue('Edytowana nazwa podmiotu')
    await expect(invoiceAddressesPage.getInvoiceAddressModalCompanyName).toHaveValue('Edytowana nazwa firmy');
    await expect(invoiceAddressesPage.getInvoiceAddressModalNIP).toHaveValue('1085179548');
    await expect(invoiceAddressesPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-100');
    await expect(invoiceAddressesPage.getInvoiceAddressModalUserCity).toHaveValue('Magdalenka');
    await expect(invoiceAddressesPage.getInvoiceAddressModalUserStreet).toHaveValue('Edytowana ulica');
    await expect(invoiceAddressesPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('100');
    await expect(invoiceAddressesPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('200');
  })
    
  test('M | Możliwość ustawienia głównych danych do faktury', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addInvoiceAddressViaAPI }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy dane do faktury');
    await allure.subSuite('');
    await allure.allureId('1481');

    test.setTimeout(120000);
    
    await addInvoiceAddressViaAPI('Fixturowy adres podmiotu');
    await addInvoiceAddressViaAPI('Testowa nazwa podmiotu');

    await page.waitForTimeout(3000);

    await page.goto('profil/dane-faktury', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('text=Fixturowy adres podmiotu', { state: 'visible' });
    await page.waitForSelector('text=Testowa nazwa podmiotu', { state: 'visible' });

    await invoiceAddressesPage.clickEditInvoiceAddressButton('Testowa nazwa podmiotu');
    await invoiceAddressesPage.getInvoiceAddressModalMainAddressCheckbox.check();
    await invoiceAddressesPage.getInvoiceAddressModalMainAddressCheckbox.isChecked();
    await invoiceAddressesPage.clickSaveInvoiceAdressModalButton();
    await invoiceAddressesPage.getMainInvoiceAddressInfo('Testowa nazwa podmiotu').isVisible();
    await expect(invoiceAddressesPage.getMainInvoiceAddressInfo('Testowa nazwa podmiotu')).toHaveText('Główny', { timeout: 20000 });
    await invoiceAddressesPage.clickEditInvoiceAddressButton('Testowa nazwa podmiotu');
    await invoiceAddressesPage.getCurrentMainInvoiceAddressModalInfo.isVisible();
    await invoiceAddressesPage.getInvoiceAddressModalMainAddressCheckbox.isHidden();
    await invoiceAddressesPage.clickCancelInvoiceAdressModalButton();

    await invoiceAddressesPage.clickEditInvoiceAddressButton('Fixturowy adres podmiotu');
    await invoiceAddressesPage.getInvoiceAddressModalMainAddressCheckbox.check();
    await invoiceAddressesPage.getInvoiceAddressModalMainAddressCheckbox.isChecked();
    await invoiceAddressesPage.clickSaveInvoiceAdressModalButton();
    await invoiceAddressesPage.getMainInvoiceAddressInfo('Fixturowy adres podmiotu').isVisible();
    await expect(invoiceAddressesPage.getMainInvoiceAddressInfo('Fixturowy adres podmiotu')).toHaveText('Główny', { timeout: 20000 });
    await invoiceAddressesPage.getMainInvoiceAddressInfo('Testowa nazwa podmiotu').isHidden();
    await expect(invoiceAddressesPage.getMainInvoiceAddressInfo('Testowa nazwa podmiotu')).not.toBeAttached({ timeout: 5000 });
  })
        
  test('M | Możliwość usunięcia danych do faktury', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addInvoiceAddressViaAPI }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy dane do faktury');
    await allure.subSuite('');
    await allure.allureId('1482');
      
    test.setTimeout(120000);

    await addInvoiceAddressViaAPI('Edytowana nazwa podmiotu');

    await page.waitForTimeout(3000);
    
    await page.goto('profil/dane-faktury', { waitUntil: 'domcontentloaded' });

    await invoiceAddressesPage.getInvoiceAddressTitle.waitFor({ state: 'visible', timeout: 10000 });

    await invoiceAddressesPage.clickDeleteInvoiceAddressButton('Edytowana nazwa podmiotu');

    await expect(invoiceAddressesPage.getInvoiceAddressModal).toBeVisible({ timeout: 3000 });
    await expect(invoiceAddressesPage.getInvoiceAddressModal).toContainText('Potwierdź usunięcie adresu');
    await expect(invoiceAddressesPage.getInvoiceAddressModalDeleteAddressName('Edytowana nazwa podmiotu')).toContainText('Edytowana nazwa podmiotu');
    await expect(invoiceAddressesPage.getInvoiceAddressModalCancelButton).toBeVisible();
    await expect(invoiceAddressesPage.getInvoiceAddressModalConfirmationButton).toBeVisible();
    await invoiceAddressesPage.getInvoiceAddressModalConfirmationButton.click();
    await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został usunięty.', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await page.waitForSelector('text=Edytowana nazwa podmiotu', { strict: true , state: 'hidden' });
  })

  test.afterEach(async ({ deleteInvoiceAddressViaAPI }) => {

    await deleteInvoiceAddressViaAPI('Testowa nazwa podmiotu');
    await deleteInvoiceAddressViaAPI('Fixturowy adres podmiotu')
    await deleteInvoiceAddressViaAPI('Edytowana nazwa podmiotu')
  })
})
