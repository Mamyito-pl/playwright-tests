import { Page, expect } from '@playwright/test';
import LoginPage from "../../page/Login.page.ts";
import ProductsListPage from '../../page/ProductsList.page.ts';
import MainLogoutPage from "../../page/MainLogout.page.ts";
import MainPage from "../../page/Main.page.ts";
import CartPage from '../../page/Cart.page.ts';
import NavigationPage from '../../page/Navigation.page.ts';
import SearchbarPage from '../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy koszyka', async () => {

  test.setTimeout(80000);

  let cartPage: CartPage;
  let productsListPage: ProductsListPage;
  let loginPage: LoginPage;
  let mainLogoutPage: MainLogoutPage;
  let mainPage: MainPage;
  let navigationPage: NavigationPage;
  let searchbarPage : SearchbarPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
    
    //await utility.addGlobalStyles(page);

    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    productsListPage = new ProductsListPage(page);
    navigationPage = new NavigationPage(page);
    searchbarPage = new SearchbarPage(page);
  })

  test.afterEach(async ({ clearCartViaAPI }) => {

    await clearCartViaAPI();
  }) 
  
  test('W | Możliwość zwiększenia ilości produktu w koszyku', { tag: ['@Smoke'] }, async ({ page, addProduct }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('437');
    
    await addProduct('cebula czerwona');

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('1');
    await cartPage.clickIncreaseProductButton();
    await page.waitForTimeout(5000);
    await expect(cartPage.getProductItemCount).toHaveValue('2');
  })

  test('W | Możliwość zmniejszenia ilości produktu w koszyku', { tag: ['@Smoke'] }, async ({ page, addProduct }) => {
    
    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('438');
    
    await addProduct('cebula czerwona');

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('1');
    for (let i = 0; i < 2; i++) {
      await cartPage.clickIncreaseProductButton();
      await page.waitForTimeout(5000);
    };
    await expect(cartPage.getProductItemCount).toHaveValue('3');
    for (let i = 0; i < 2; i++) {
      await cartPage.clickDecreaseProductButton();
      await page.waitForTimeout(5000);
    };
    await expect(cartPage.getProductItemCount).toHaveValue('1');
  }) 

  test('W | Możliwość usunięcia produktu z koszyka', { tag: ['@Smoke'] }, async ({ page, addProduct }) => {  
    
    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('435');

    await addProduct('cebula czerwona');

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('1');
    await cartPage.clickDeleteProductCartIcon();
    await cartPage.clickDeleteProductCartConfirmButton();
    await page.waitForTimeout(2000);
    await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty');
  }) 

  test('W | Możliwość dodania produktu w ilości > 1 do koszyka', { tag: ['@Smoke'] }, async ({ page }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('434');

    await searchbarPage.clickSearchbar()
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 15000 });
    await searchbarPage.enterProduct('cebula czerwona');
    await expect(page.locator('div[role="status"]')).toBeHidden({ timeout: 15000 });
    await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click();
    await page.waitForTimeout(5000);
    await searchbarPage.clickIncreaseProductButton();
    await page.waitForTimeout(5000);
    await expect(searchbarPage.getProductItemCount).toHaveValue('2');
    await cartPage.clickCartDrawerButton();
    await cartPage.clickShowCartButton();
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('2');
  })

  test('W | Pusta szuflada koszyka otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('442');

    await cartPage.clickCartDrawerButton();
    
    await expect(cartPage.getCartDrawer).toBeVisible();

    await expect(cartPage.getCartTitle).toBeVisible();
    await expect(cartPage.getCartTitle).toHaveText('Twój koszyk(0 produktów)');

    await expect(cartPage.getCartDrawerCloseIconButton).toBeVisible();

    await expect(cartPage.getShowCartButton).toBeVisible();
    await expect(cartPage.getShowCartButton).toHaveText('Pokaż koszyk');

    await expect(cartPage.getClearCartButton).toBeVisible();
    await expect(cartPage.getClearCartButton).toBeDisabled();
    await expect(cartPage.getClearCartButton).toHaveText('Wyczyść koszyk');

    await expect(cartPage.getEmptyCartNotification).toBeVisible();
    await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty');

    await expect(cartPage.getCartCodesTitle).toBeVisible();
    await expect(cartPage.getCartCodesTitle).toContainText('Kody Rabatowe');

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible();
    await expect(cartPage.getCartAvailableCodesButton).toContainText('Dostępne kody rabatowe:');
    
    await expect(cartPage.getCartDrawerSummaryTitle).toBeVisible();
    await expect(cartPage.getCartDrawerSummaryTitle).toContainText('Podsumowanie');  

    await expect(cartPage.getcartDrawerProductsValue).toBeVisible();
    await expect(cartPage.getcartDrawerProductsValue).toContainText('Wartość produktów0,00 zł');  

    await expect(cartPage.getCartDrawerToCartButton).toBeVisible();
    await expect(cartPage.getCartDrawerToCartButton).toHaveText('Do kasy 0,00 zł');
  })

  test('W | Szuflada koszyka zamyka się po kliknięciu poza nią', async ({ page }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('439');

    await expect(cartPage.getCartDrawer).toBeHidden();
    await cartPage.clickCartDrawerButton();
    await expect(cartPage.getCartDrawer).toBeVisible();
    await searchbarPage.clickSearchbar();
    await expect(cartPage.getCartDrawer).toBeHidden();
  })

  test('W | Szuflada koszyka zamyka się po kliknięciu ikonki "X"', async ({ page }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('440');

    await expect(cartPage.getCartDrawer).toBeHidden();
    await cartPage.clickCartDrawerButton();
    await expect(cartPage.getCartDrawer).toBeVisible();
    await cartPage.clickCloseDrawerIconButton();
    await expect(cartPage.getCartDrawer).toBeHidden()
  })

  test('W | Możliwość przejścia do koszyka z szuflady koszyka', async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('443');
    
    const product = 'woda';

    await addProduct(product);
    await cartPage.clickCartDrawerButton();
    await expect(cartPage.getCartDrawerToCartButton).toBeEnabled();
    await cartPage.getCartDrawerToCartButton.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
  })

  test('W | Możliwość przejścia z koszyka do strony głównej przyciskiem "Cofnij"', async ({ page, baseURL }) => {

    await allure.tags('Web', 'Koszyk');
    await allure.epic('Webowe');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('496');
    
    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await expect(cartPage.getCartReturnButton).toBeVisible();
    await cartPage.getCartReturnButton.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(`${baseURL}`);
    await expect(mainPage.getBannersSection).toBeVisible();
  })

  test.describe('W | Możliwość dodania do koszyka najczęściej kupowanych produktów', async () => {

    test.setTimeout(80000);

    test('W | Możliwość dodania do koszyka wody', async ({ page, addProduct }) => {

      await allure.tags('Web', 'Koszyk');
      await allure.epic('Webowe');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('497');
      
      const product = 'woda';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});

      await page.waitForSelector(selectors.CartPage.common.productCartListName)

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('woda');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator(selectors.CartPage.common.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })

    test('W | Możliwość dodania do koszyka bułki', async ({ page, addProduct }) => {

      await allure.tags('Web', 'Koszyk');
      await allure.epic('Webowe');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('498');
      
      const product = 'bułka kajzerka putka';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});

      await page.waitForSelector(selectors.CartPage.common.productCartListName)

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('bułka');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator(selectors.CartPage.common.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })

    test('W | Możliwość dodania do koszyka banana', async ({ page, addProduct }) => {

      await allure.tags('Web', 'Koszyk');
      await allure.epic('Webowe');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('499');
      
      const product = 'banan zieleniak';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});

      await page.waitForSelector(selectors.CartPage.common.productCartListName)

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('banan');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator(selectors.CartPage.common.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })

    test('W | Możliwość dodania do koszyka serka wiejskiego', async ({ page, addProduct }) => {

      await allure.tags('Web', 'Koszyk');
      await allure.epic('Webowe');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('500');
      
      const product = 'serek wiejski piątnica';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});

      await page.waitForSelector(selectors.CartPage.common.productCartListName)

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('serek wiejski');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator(selectors.CartPage.common.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })
  })
})
