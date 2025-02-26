// fixtures.ts
import { test as baseTest, Page } from '@playwright/test';
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
    loginViaAPI: (page: Page) => Promise<void>;
    clearCart: () => Promise<void>;
    clearCartViaAPI: () => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    addAddressDelivery: (addressName: any) => Promise<void>;
    deleteAddressDelivery: (addressName: any) => Promise<void>;
    addInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    deleteInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    deleteAddressDeliveryProfile: (addressName: any) => Promise<void>;
    addAddressDeliveryProfile: (addressName: any) => Promise<void>;
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
      await page.waitForURL('/', { waitUntil: 'networkidle', timeout: 20000 });
      await utility.addGlobalStyles(page);
      await expect(mainLogoutPage.getLoginLink).toBeHidden();
    };
    await use(login);
  },

  storageState: 'playwright/.auth/user.json',

  clearCart: async ({ page }, use) => {

    cartPage = new CartPage(page);

    const clearCart = async (): Promise<void> => {

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForTimeout(2000);

      if (await cartPage.getClearCartButton.isDisabled()) {
        await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty', { timeout: 10000});
      } else {
        await cartPage.clickClearCartButton();
        await page.waitForSelector(selectors.CartPage.common.clearCartConfirmButton, { state: 'visible', timeout: 10000 });
        await cartPage.clickClearCartConfirmButton();
        await page.waitForTimeout(2000);
        await page.reload();
        await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty', { timeout: 10000});
      }
    };
    await use(clearCart);
  },

  clearCartViaAPI: async ({ page, request }, use) => {
    cartPage = new CartPage(page);
    
    const clearCartViaAPI = async (): Promise<void> => {
      
      const tokenResponse = await request.post('https://api.mamyito.pl/api/login', {
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();
      const token = responseBodyToken.data.token;

      const cartIDResponse = await request.post('https://api.mamyito.pl/api/cart/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseBodyCartID = await cartIDResponse.json();
      const cart_id = responseBodyCartID.data.id;

      const deleteItemsFromCart = await request.delete(`https://api.mamyito.pl/api/cart/${cart_id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(deleteItemsFromCart.status()).toBe(200);
    };
    
    await use(clearCartViaAPI);
  },

  addProduct: async ({ page }, use) => {

    cartPage = new CartPage(page);
    searchbarPage = new SearchbarPage(page);

    const viewport = page.viewportSize();

    if (!viewport) throw new Error('Viewport is null');

    const mobile = utility.isMobile(viewport.width);

    const addProduct = async (product: string) => {

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

    const addAddressDelivery = async (addressName: string) => {

      await deliveryPage.clickAddNewAddressButton();
      await page.waitForSelector('div[class*="sc-f8f81ad2-1"]', { state: 'visible', timeout: 10000 });
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
      await page.waitForTimeout(3000)
      
      await page.getByText(addressName).isVisible();
    };
    await use(addAddressDelivery);
  },

  deleteAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteAddressDelivery = async (addressName: string) => {

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-trash"]').click();

      await page.waitForSelector('div[class*="sc-f8f81ad2-1"]', { state: 'visible', timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName(`${addressName}`)).toContainText(`${addressName}`);
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await page.waitForTimeout(3000)

      await page.getByText(addressName).isHidden();
    };
    await use(deleteAddressDelivery);
  },

  addInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const addInvoiceAddressDelivery = async (addressName: string) => {
      
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await page.waitForSelector('div[class*="sc-f8f81ad2-1"]', { state: 'visible', timeout: 10000 });
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
      await page.waitForTimeout(3000)

      await page.getByText(addressName).isVisible();
    };
    await use(addInvoiceAddressDelivery);
  },

  deleteInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteInvoiceAddressDelivery = async (addressName: string) => {

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg').nth(2).click();

      await page.waitForSelector('div[class*="sc-f8f81ad2-1"]', { state: 'visible', timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName(`${addressName}`)).toContainText(`${addressName}`);
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await page.waitForTimeout(3000)

      await page.getByText(addressName).isHidden();
    };
    await use(deleteInvoiceAddressDelivery);
  }
});

export const expect = test.expect;
