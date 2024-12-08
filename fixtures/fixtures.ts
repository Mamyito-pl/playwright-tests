// fixtures.ts
import { test as baseTest } from '@playwright/test';
import LoginPage from "../page/Login.page.ts";
import MainLogoutPage from "../page/MainLogout.page.ts";
import CartPage from '../page/Cart.page.ts';
import SearchbarPage from '../page/Searchbar.page.ts';
import * as selectors from '../utils/selectors.json';
import * as utility from '../utils/utility-methods';

let loginPage: LoginPage;
let mainLogoutPage: MainLogoutPage;
let cartPage: CartPage;
let searchbarPage : SearchbarPage;


type MyFixtures = {
    loginManual: () => Promise<void>;
    clearCart: () => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    getToken: () => Promise<string>;
};

export const test = baseTest.extend<MyFixtures>({

  loginManual: async ({ page, baseURL }, use) => {
    
    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    
    const login = async (): Promise<void> => {
      
      page.on('framenavigated', async () => {
        await utility.addGlobalStyles(page);
      });
      await page.goto('/logowanie', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000)
      await loginPage.enterEmail(`${process.env.EMAIL}`);
      await loginPage.enterPassword(`${process.env.PASSWORD}`);
      await loginPage.clickLoginButton();
      await page.waitForURL('/', { waitUntil: 'domcontentloaded'});
      await utility.addGlobalStyles(page);
      await expect(mainLogoutPage.getLoginLink).toBeHidden();
    };
    await use(login);
  },

  clearCart: async ({ page }, use) => {

    cartPage = new CartPage(page);

    const clearCart = async (): Promise<void> => {

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForTimeout(2000)
      await cartPage.clickClearCartButton();
      await page.waitForSelector(selectors.CartPage.common.clearCartConfirmButton, { state: 'visible', timeout: 5000 })
      await cartPage.clickClearCartConfirmButton();
      await expect(cartPage.getEmptyCartNotification).toBeAttached({ timeout: 10000 });
      await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty', { timeout: 10000})
    };
    await use(clearCart);
  },

  addProduct: async ({ page }, use) => {

    test.setTimeout(80000);

    cartPage = new CartPage(page);
    searchbarPage = new SearchbarPage(page);

    const viewport = page.viewportSize();

    if (!viewport) throw new Error('Viewport is null');

    const mobile = utility.isMobile(viewport.width);

    const addProduct = async (product) => {

      const searchbarInputSelector = mobile ? selectors.Searchbar.mobile.searchbarInput : selectors.Searchbar.web.searchbarInput;

      await page.locator(searchbarInputSelector).click();
      await page.waitForTimeout(2000);
      await searchbarPage.enterProduct(product);
      await page.waitForTimeout(5000);
      await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click();
      await page.waitForTimeout(2000);
    };
    await use(addProduct);
  }
});

export const expect = test.expect;
