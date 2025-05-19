// fixtures.ts
import { test as baseTest, Page } from '@playwright/test';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import CartPage from '../page/Cart.page.ts';
import SearchbarPage from '../page/Searchbar.page.ts';
import DeliveryPage from '../page/Delivery.page.ts';
import CommonPage from '../page/Common.page.ts'
import * as selectors from '../utils/selectors.json';
import * as utility from '../utils/utility-methods';

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;
let cartPage: CartPage;
let searchbarPage : SearchbarPage;
let deliveryPage : DeliveryPage;
let commonPage: CommonPage;


type MyFixtures = {
    loginManual: () => Promise<void>;
    loginViaAPI: (page: Page) => Promise<void>;
    clearCart: () => Promise<void>;
    clearCartViaAPI: () => Promise<void>;
    newsletterSignOutViaAPI: () => Promise<void>;
    searchProduct: (productName: any) => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    addAddressDelivery: (addressName: any) => Promise<void>;
    addAddressDeliveryViaAPI: (addressName: any) => Promise<void>;
    addSecondAddressDeliveryViaAPI: (addressName: any) => Promise<void>;
    deleteAddressDelivery: (addressName: any) => Promise<void>;
    deleteDeliveryAddressViaAPI: (addressName: any) => Promise<void>;
    addInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    addInvoiceAddressViaAPI: (addressName: any) => Promise<void>;
    deleteInvoiceAddressViaAPI: (addressName: any) => Promise<void>;
    deleteInvoiceAddressDelivery: (addressName: any) => Promise<void>;
    deleteAddressDeliveryProfile: (addressName: any) => Promise<void>;
    addAddressDeliveryProfile: (addressName: any) => Promise<void>;
    cancelOrderViaAPI: (page: Page) => Promise<void>;
    cancelEditOrderViaAPI: (page: Page) => Promise<void>;
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
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const cartIDResponse = await request.post(`${process.env.APIURL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseBodyCartID = await cartIDResponse.json();
      const items = responseBodyCartID.data.items;
      const cart_id = responseBodyCartID.data.id;

      if (!items || items.length === 0) {
        return;
      }

      const deleteItemsFromCart = await request.delete(`${process.env.APIURL}/api/cart/${cart_id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(deleteItemsFromCart.status()).toBe(200);
    };
    
    await use(clearCartViaAPI);
  },

  newsletterSignOutViaAPI: async ({ request }, use) => {
    
    const clearCartViaAPI = async (): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const newsletterSignOutResponse = await request.post(`${process.env.APIURL}/api/newsletter/sign-out`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
          data: {
            email: `${process.env.EMAIL}`,
          },
      });

      expect(newsletterSignOutResponse.status()).toBe(200);
    };
    
    await use(clearCartViaAPI);
  },

  searchProduct: async ({ page }, use) => {

    cartPage = new CartPage(page);
    searchbarPage = new SearchbarPage(page);
    commonPage = new CommonPage(page);

    const viewport = page.viewportSize();

    if (!viewport) throw new Error('Viewport is null');

    const searchProduct = async (productName: string) => {

      await searchbarPage.getSearchbarInput.click();
      await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
      await searchbarPage.enterProduct(productName);
      await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
      await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });
    };
    await use(searchProduct);
  },

  addProduct: async ({ page }, use) => {

    cartPage = new CartPage(page);
    searchbarPage = new SearchbarPage(page);
    commonPage = new CommonPage(page);

    const viewport = page.viewportSize();

    if (!viewport) throw new Error('Viewport is null');

    const addProduct = async (product: string) => {

      await searchbarPage.getSearchbarInput.click();
      await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
      await searchbarPage.enterProduct(product);
      await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
      await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
      await page.waitForTimeout(4000);
    };
    await use(addProduct);
  },

  addAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const addAddressDelivery = async (addressName: string) => {

      await deliveryPage.clickAddNewAddressButton();
      await page.waitForSelector('div[data-sentry-element="Modal"]', { state: 'visible', timeout: 10000 });
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

  addAddressDeliveryViaAPI: async ({ request }, use) => {
    
    const addAddressDeliveryViaAPI = async (addressName: string): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const addDeliveryAddress = await request.post(`${process.env.APIURL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          city: "Warszawa",
          first_name: "Jan",
          last_name: "Kowalski",
          house_number: "1",
          icon_color: "#ffa31a",
          icon_type: "home",
          is_default: false,
          latitude: 11,
          longitude: 11,
          name: `${addressName}`,
          phone_number: "555666777",
          postal_code: "00-828",
          street: "aleja Jana Pawła II",
          staircase_number: "1",
          flat_number: "30",
          type: "delivery"
        },
      });

      expect(addDeliveryAddress.status()).toBe(201);
    };
    
    await use(addAddressDeliveryViaAPI);
  },

  addSecondAddressDeliveryViaAPI: async ({ request }, use) => {
    
    const addSecondAddressDeliveryViaAPI = async (addressName: string): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const addDeliveryAddress = await request.post(`${process.env.APIURL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          city: "Lesznowola",
          first_name: "Janina",
          last_name: "Kowalska",
          house_number: "4",
          icon_color: "#ffa31a",
          icon_type: "home",
          is_default: false,
          latitude: 11,
          longitude: 11,
          name: `${addressName}`,
          phone_number: "666555444",
          postal_code: "05-506",
          street: "Oficerska",
          staircase_number: null,
          flat_number: null,
          type: "delivery"
        },
      });

      expect(addDeliveryAddress.status()).toBe(201);
    };
    
    await use(addSecondAddressDeliveryViaAPI);
  },

  deleteAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteAddressDelivery = async (addressName: string) => {

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-trash"]').click();

      await page.waitForSelector('div[data-sentry-element="Modal"]', { state: 'visible', timeout: 10000 });
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

  deleteDeliveryAddressViaAPI: async ({ request }, use) => {
    
    const deleteDeliveryAddressViaAPI = async (addressName: string): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const deliveryAddressesResponse = await request.get(`${process.env.APIURL}/api/addresses/delivery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseBodyAddresses = await deliveryAddressesResponse.json();
      const addresses = responseBodyAddresses.data;

      const addressToDelete = addresses.find(address => address.name === addressName);

      if (!addressToDelete) {
        return;
      }

      const deliveryAddress_id = addressToDelete.id;

      const deleteDeliveryAddress = await request.delete(`${process.env.APIURL}/api/addresses/${deliveryAddress_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(deleteDeliveryAddress.status()).toBe(204);
    };
    
    await use(deleteDeliveryAddressViaAPI);
  },

  addInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const addInvoiceAddressDelivery = async (addressName: string) => {
      
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await page.waitForSelector('div[data-sentry-element="Modal"]', { state: 'visible', timeout: 10000 });
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
  
  addInvoiceAddressViaAPI: async ({ request }, use) => {
    
    const addInvoiceAddressViaAPI = async (addressName: string): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const addDeliveryAddress = await request.post(`${process.env.APIURL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          city: "Warszawa",
          house_number: "1",
          nip: "8140667487",
          company_name: "Testowa firma",
          icon_color: "#ffa31a",
          icon_type: "company",
          is_default: false,
          name: `${addressName}`,
          postal_code: "00-828",
          street: "aleja Jana Pawła II",
          flat_number: "30",
          type: "invoice"
        },
      });

      expect(addDeliveryAddress.status()).toBe(201);
    };
    
    await use(addInvoiceAddressViaAPI);
  },

  deleteInvoiceAddressDelivery: async ({ page }, use) => {

    deliveryPage = new DeliveryPage(page);

    const deleteInvoiceAddressDelivery = async (addressName: string) => {

      await page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg [class="tabler-icon tabler-icon-trash"]').last().click();

      await page.waitForSelector('div[data-sentry-element="Modal"]', { state: 'visible', timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toBeVisible();
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName(`${addressName}`)).toContainText(`${addressName}`);
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await page.waitForTimeout(3000)

      await page.getByText(addressName).isHidden();
    };
    await use(deleteInvoiceAddressDelivery);
  },

  deleteInvoiceAddressViaAPI: async ({ request }, use) => {
    
    const deleteInvoiceAddressViaAPI = async (addressName: string): Promise<void> => {
      
      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: {
          'Accept': 'application/json'
      },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });

      const responseBodyToken = await tokenResponse.json();

      const token = responseBodyToken.data.token;

      const invoiceAddressesResponse = await request.get(`${process.env.APIURL}/api/addresses/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const responseBodyAddresses = await invoiceAddressesResponse.json();
      const addresses = responseBodyAddresses.data;

      const addressToDelete = addresses.find(address => address.name === addressName);

      if (!addressToDelete) {
        return;
      }

      const invoiceAddress_id = addressToDelete.id;

      const deleteInvoiceAddress = await request.delete(`${process.env.APIURL}/api/addresses/${invoiceAddress_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(deleteInvoiceAddress.status()).toBe(204);
    };
    
    await use(deleteInvoiceAddressViaAPI);
  },

  cancelOrderViaAPI: async ({ request }, use) => {
    const cancelOrderViaAPI = async (page: Page) => {

      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: { 'Accept': 'application/json' },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });
      const responseBodyToken = await tokenResponse.json();
      const token = responseBodyToken.data.token;

      const url = new URL(page.url());
      const saleOrderId = url.searchParams.get('order');
      if (!saleOrderId) throw new Error('Brak saleOrderId w URL');

      const response = await request.patch(`${process.env.APIURL}/api/sale-orders/${saleOrderId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status() === 504 || response.ok()).toBeTruthy();
    };
    await use(cancelOrderViaAPI);
  },

  cancelEditOrderViaAPI: async ({ request }, use) => {
    const cancelEditOrderViaAPI = async (page: Page) => {

      const tokenResponse = await request.post(`${process.env.APIURL}/api/login`, {
        headers: { 'Accept': 'application/json' },
        data: {
          email: `${process.env.EMAIL}`,
          password: `${process.env.PASSWORD}`,
        },
      });
      const responseBodyToken = await tokenResponse.json();
      const token = responseBodyToken.data.token;

      const url = new URL(page.url());
      const saleOrderId = url.searchParams.get('order');
      if (!saleOrderId) throw new Error('Brak saleOrderId w URL');

      const response = await request.delete(`${process.env.APIURL}/api/sale-orders/${saleOrderId}/edit-cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status() === 504 || response.ok()).toBeTruthy();
    };
    await use(cancelEditOrderViaAPI);
  }
});

export const expect = test.expect;
