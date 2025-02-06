// fixtures.ts
import { test as baseTest } from '@playwright/test';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import CartPage from '../page/Cart.page.ts';
import SearchbarPage from '../page/Searchbar.page.ts';
import DeliveryPage from '../page/Delivery.page.ts';
import * as selectors from '../utils/selectors.json';
import * as utility from '../utils/utility-methods';

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;
let cartPage: CartPage;
let searchbarPage : SearchbarPage;
let deliveryPage : DeliveryPage;


type MyFixtures = {
    loginManual: () => Promise<void>;
    clearCart: () => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    addAddressDelivery: (addressName: any) => Promise<void>;
    deleteAddressDelivery: (addressName: any) => Promise<void>;
    addInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    deleteInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    getToken: () => Promise<string>;
};

export const test = baseTest.extend<MyFixtures>({

  loginManual: async ({ page }, use) => {
    
    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    
    const login = async (): Promise<void> => {
      
      page.on('framenavigated', async () => {
        await utility.addGlobalStyles(page);
      });
      await page.goto('/logowanie', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await loginPage.enterEmail(`${process.env.EMAIL}`);
      await loginPage.enterPassword(`${process.env.PASSWORD}`);
      await loginPage.clickLoginButton();
      await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await utility.addGlobalStyles(page);
      await expect(mainLogoutPage.getLoginLink).toBeHidden();
    };
    await use(login);
  },

  clearCart: async ({ page }, use) => {

    cartPage = new CartPage(page);

    const clearCart = async (): Promise<void> => {

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForTimeout(2000);
      await cartPage.clickClearCartButton();
      await page.waitForSelector(selectors.CartPage.common.clearCartConfirmButton, { state: 'visible', timeout: 10000 });
      await cartPage.clickClearCartConfirmButton();
      await page.waitForTimeout(2000);
      await page.reload();
      await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty', { timeout: 10000});
    };
    await use(clearCart);
  },

  addProduct: async ({ page }, use) => {

    cartPage = new CartPage(page);
    searchbarPage = new SearchbarPage(page);

    const viewport = page.viewportSize();

    if (!viewport) throw new Error('Viewport is null');

    const mobile = utility.isMobile(viewport.width);

    const addProduct = async (product) => {

      const searchbarInputSelector = mobile ? selectors.Searchbar.mobile.searchbarInput : selectors.Searchbar.web.searchbarInput;
      const searchbarCloseButtonSelector = mobile ? selectors.Searchbar.mobile.searchbarCloseButton : selectors.Searchbar.web.searchbarCloseButton

      await page.locator(searchbarInputSelector).click();
      await expect(page.locator(searchbarCloseButtonSelector)).toBeVisible({ timeout: 10000 });
      await searchbarPage.enterProduct(product);
      await expect(page.locator(selectors.Common.loader)).toBeHidden({ timeout: 15000 });
      await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click();
      await page.waitForTimeout(2000);
    };
    await use(addProduct);
  },

  addAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const addAddressDelivery = async (addressName) => {

      await deliveryPage.clickAddNewAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await deliveryPage.getAddressModalAddressName.fill(addressName);
      await deliveryPage.getAddressModalUserName.fill('Jan');
      await deliveryPage.getAddressModalUserSurname.fill('Kowalski')
      await deliveryPage.getAddressModalUserPhoneNumber.fill('555666777');
      await deliveryPage.getAddressModalUserPostalCode.fill('00-828');
      await deliveryPage.getAddressModalUserCity.fill('Warszawa');
      await deliveryPage.getAddressModalUserStreet.fill('aleja Jana Pawła II');
      await deliveryPage.getAddressModalUserHouseNumber.fill('1');
      await deliveryPage.getAddressModalUserStaircase.fill('1');
      await deliveryPage.getAddressModalUserFlatNumber.fill('30');
      /*await deliveryPage.getAddressModalUserFloor.fill('2');
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka');*/   // Uncomment after done task KAN-801
      await deliveryPage.clickSaveAdressModalButton();
      await page.getByText(addressName).isVisible();
    };
    await use(addAddressDelivery);
  },

  deleteAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteAddressDelivery = async (addressName) => {

      const addressesCount = await page.locator('div[class*="sc-91ca8657-3"]').count();

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg').nth(2).click();

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName(`${addressName}`)).toContainText(`${addressName}`);
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await page.waitForTimeout(3000)

      const addressesCountAfterDelete = await page.locator('div[class*="sc-91ca8657-3"]').count();

      expect(addressesCountAfterDelete).toBeLessThan(addressesCount);
    };
    await use(deleteAddressDelivery);
  },

  addInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const addInvoiceAddressDelivery = async (addressName) => {

      const isVisible = await deliveryPage.getDeliveryInvoiceCheckbox.isVisible();

      if (isVisible) {
      const isChecked = await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();

      if (!isChecked) {
          await deliveryPage.getDeliveryInvoiceCheckbox.check();
      }}
      
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await deliveryPage.getInvoiceAddressModalAddressName.fill(addressName);
      await deliveryPage.getInvoiceAddressModalCompanyName.fill('Testowa firma');
      await deliveryPage.getInvoiceAddressModalNIP.fill('8140667487');
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-828');
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Warszawa');
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('aleja Jana Pawła II');
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('1');
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('30');
      /*await deliveryPage.getAddressModalUserFloor.fill('2');
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka');*/   // Uncomment after done task KAN-801
      await deliveryPage.clickSaveAdressModalButton();
      await page.getByText(addressName).isVisible();
    };
    await use(addInvoiceAddressDelivery);
  },

  deleteInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteInvoiceAddressDelivery = async (addressName) => {

      const addressesCount = await page.locator('div[class*="sc-7290070c-3"]').count();

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg').nth(2).click();

      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName(`${addressName}`)).toContainText(`${addressName}`);
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await page.waitForTimeout(3000)

      const addressesCountAfterDelete = await page.locator('div[class*="sc-7290070c-3"]').count();

      expect(addressesCountAfterDelete).toBeLessThan(addressesCount);
    };
    await use(deleteInvoiceAddressDelivery);
  }
});

export const expect = test.expect;
