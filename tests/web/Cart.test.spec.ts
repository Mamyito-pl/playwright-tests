import { Page, expect } from '@playwright/test';
import LoginPage from "../../page/Login.page.ts";
import ProductsPage from '../../page/Products.page.ts';
import MainLogoutPage from "../../page/MainLogout.page.ts";
import MainPage from "../../page/Main.page.ts";
import CartPage from '../../page/Cart.page.ts';
import NavigationPage from '../../page/Navigation.page.ts';
import SearchbarPage from '../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';

test.describe('Testy koszyka @koszyk', async () => {
  
  test.describe.configure({ mode: 'serial'})

  test.setTimeout(80000);

  let cartPage: CartPage;
  let productsPage: ProductsPage;
  let loginPage: LoginPage;
  let mainLogoutPage: MainLogoutPage;
  let mainPage: MainPage;
  let navigationPage: NavigationPage;
  let searchbarPage : SearchbarPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await loginManual();

    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    productsPage = new ProductsPage(page);
    navigationPage = new NavigationPage(page);
    searchbarPage = new SearchbarPage(page);
  })

  test.afterEach(async ({ clearCart }) => {
    const shouldSkipClearCart = test.info().annotations.some(a => a.type === 'skipClearCart');

    if (!shouldSkipClearCart) {
      await clearCart();
  }
  }) 
  
  test('Możliwość zwiększenia ilości produktu w koszyku', async ({ page, addProduct }) => {
    
    await addProduct('cytryna zieleniak');

    await page.goto('/koszyk');
    await page.waitForTimeout(2000);
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveText('1');
    await cartPage.clickIncreaseProductButton();
    await expect(cartPage.getProductItemCount).toHaveText('2');
  })

  test('Możliwość zmniejszenia ilości produktu w koszyku', async ({ page, addProduct }) => {
    
    await addProduct('cytryna zieleniak');

    await page.goto('/koszyk');
    await page.waitForTimeout(2000);
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveText('1');
    for (let i = 0; i < 2; i++) {
      await cartPage.clickIncreaseProductButton();
    };
    await expect(cartPage.getProductItemCount).toHaveText('3');
    for (let i = 0; i < 2; i++) {
      await cartPage.clickDecreaseProductButton();
    };
    await expect(cartPage.getProductItemCount).toHaveText('1');
  }) 

  test('Możliwość usunięcia produktu z koszyka', async ({ page, addProduct }) => {   
    
    test.info().annotations.push({ type: 'skipClearCart' });

    await addProduct('cytryna zieleniak');

    await page.goto('/koszyk');
    await page.waitForTimeout(2000);
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveText('1');
    await cartPage.clickDeleteProductCartIcon();
    await page.waitForTimeout(2000);
    await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty');
  }) 

  test('Możliwość dodania produktu w ilości > 1 do koszyka', async ({ page }) => {

    await searchbarPage.clickSearchbar()
    await page.waitForTimeout(2000);
    await searchbarPage.enterProduct('cytryna zieleniak');
    await page.waitForTimeout(4000);
    await page.locator(selectors.ProductsPage.common.productCardAddButton).first().click();
    await page.waitForTimeout(2000);
    await searchbarPage.clickIncreaseProductButton();
    await page.waitForTimeout(1000);
    await expect(searchbarPage.getProductItemCount).toHaveText('2');
    await page.goto('/koszyk');
    await page.waitForTimeout(2000);
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveText('2');
  })

  test('Pusta szuflada koszyka otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {
    
    test.info().annotations.push({ type: 'skipClearCart' });

    await cartPage.clickCartButton();
    
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
    await expect(cartPage.getCartCodesTitle).toHaveText('Kody Rabatowe');

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible();
    await expect(cartPage.getCartAvailableCodesButton).toContainText('Dostępne kody rabatowe:');
    
    await expect(cartPage.getCartDrawerSummaryTitle).toBeVisible();
    await expect(cartPage.getCartDrawerSummaryTitle).toContainText('Podsumowanie');  

    await expect(cartPage.getcartDrawerProductsValue).toBeVisible();
    await expect(cartPage.getcartDrawerProductsValue).toContainText('Wartość produktów0,00 zł');  

    await expect(cartPage.cartDrawerDeliveryCosts).toBeVisible();
    await expect(cartPage.cartDrawerDeliveryCosts).toContainText('Koszt dostawyWybierz termin');  

    await expect(cartPage.cartDrawerDeliveryMinimalValue).toBeVisible();
    await expect(cartPage.cartDrawerDeliveryMinimalValue).toContainText('Do minimalnej wartości koszyka brakuje:150,00 zł');  

    await expect(cartPage.getCartDrawerToCartButton).toBeVisible();
    await expect(cartPage.getCartDrawerToCartButton).toHaveText('Do kasy 0,00 zł');
  })

  test('Szuflada koszyka zamyka się po kliknięciu poza nią', async ({ page }) => {
    
    test.info().annotations.push({ type: 'skipClearCart' });

    await expect(cartPage.getCartDrawer).toBeHidden();
    await cartPage.clickCartButton();
    await expect(cartPage.getCartDrawer).toBeVisible();
    await searchbarPage.clickSearchbar();
    await expect(cartPage.getCartDrawer).toBeHidden();
  })

  test('Szuflada koszyka zamyka się po kliknięciu ikonki "X"', async ({ page }) => {
    
    test.info().annotations.push({ type: 'skipClearCart' });

    await expect(cartPage.getCartDrawer).toBeHidden();
    await cartPage.clickCartButton();
    await expect(cartPage.getCartDrawer).toBeVisible();
    await cartPage.clickCloseDrawerIconButton();
    await expect(cartPage.getCartDrawer).toBeHidden()
  })

  test('Możliwość przejścia do koszyka z szuflady koszyka', async ({ page, baseURL, addProduct }) => {
    
    const product = 'woda';

    await addProduct(product);
    await cartPage.clickCartButton();
    await expect(cartPage.getCartDrawerToCartButton).toBeEnabled()
    await cartPage.getCartDrawerToCartButton.click();
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await expect(cartPage.getCartSummaryButton).toBeVisible();
  })

  test('Możliwość przejścia z koszyka do strony głównej przyciskiem "Cofnij"', async ({ page, baseURL }) => {
    
    test.info().annotations.push({ type: 'skipClearCart' });
    
    await page.goto('/koszyk');
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await expect(cartPage.getCartReturnButton).toBeVisible();
    await cartPage.getCartReturnButton.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(`${baseURL}`);
    await expect(mainPage.getBannersSection).toBeVisible();
  })

  test.describe('Możliwość dodania do koszyka najczęściej kupowanych produktów', async () => {
    
    test.describe.configure({ mode: 'serial'});
    
    test.setTimeout(80000);

    test('Możliwość dodania do koszyka wody', async ({ page, addProduct }) => {
      
      const product = 'woda';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk');
      await page.waitForTimeout(2000);

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
    test('Możliwość dodania do koszyka bułki', async ({ page, addProduct }) => {
      
      const product = 'bułka kajzerka putka';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk');
      await page.waitForTimeout(2000);

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
    test('Możliwość dodania do koszyka banana', async ({ page, addProduct }) => {
      
      const product = 'banan zieleniak';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk');
      await page.waitForTimeout(2000);

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
    test('Możliwość dodania do koszyka serka wiejskiego', async ({ page, addProduct }) => {
      
      const product = 'serek wiejski piątnica';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsPage.web.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk');
      await page.waitForTimeout(2000);

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
