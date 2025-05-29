import { expect } from '@playwright/test';
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
import CommonPage from '../../page/Common.page.ts';

test.describe.configure({ mode: 'serial'})

test.describe('Testy koszyka', async () => {

  let cartPage: CartPage;
  let productsListPage: ProductsListPage;
  let loginPage: LoginPage;
  let mainLogoutPage: MainLogoutPage;
  let mainPage: MainPage;
  let navigationPage: NavigationPage;
  let searchbarPage : SearchbarPage;
  let commonPage : CommonPage;
  let product: string = 'janex polędwica wołowa';

  test.beforeEach(async ({ page }) => {

    test.setTimeout(80000);

    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    loginPage = new LoginPage(page);
    mainLogoutPage = new MainLogoutPage(page);
    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    productsListPage = new ProductsListPage(page);
    navigationPage = new NavigationPage(page);
    searchbarPage = new SearchbarPage(page);
    commonPage = new CommonPage(page);
  })

  test.afterEach(async ({ clearCartViaAPI }) => {
    
    await clearCartViaAPI();
  }) 
  
  test('M | Możliwość zwiększenia ilości produktu w koszyku', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addProduct }) => {
    
    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('465');

    await addProduct(product);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
    const notificationButtonIsVisible = await notificationButton.isVisible();

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }

    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('1');
    await cartPage.clickIncreaseProductButton();
    await expect(cartPage.getProductItemCount).toHaveValue('2');
  })

  test('M | Możliwość zmniejszenia ilości produktu w koszyku', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addProduct }) => {
    
    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('466');

    await addProduct(product);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
    const notificationButtonIsVisible = await notificationButton.isVisible();

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }

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

  test('M | Możliwość usunięcia produktu z koszyka', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addProduct }) => {   
    
    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('467');

    await addProduct(product);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
    const notificationButtonIsVisible = await notificationButton.isVisible();

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }

    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('1');
    await cartPage.clickDeleteProductCartIcon();
    await cartPage.clickDeleteProductCartConfirmButton();
    await page.reload()
    await expect(cartPage.getEmptyCartNotification).toHaveText('Twój koszyk jest pusty');
  }) 

  test('M | Możliwość dodania produktu w ilości > 1 do koszyka', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('475');

    await searchbarPage.clickSearchbar();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 15000 });
    await searchbarPage.enterProduct(product);
    await expect(page.locator('div[role="status"]')).toBeHidden({ timeout: 15000 });
    await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click();
    await page.waitForTimeout(5000);
    await searchbarPage.clickIncreaseProductButton();
    await page.waitForTimeout(5000);
    await expect(searchbarPage.getProductItemCount).toHaveValue('2');
    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
    const notificationButtonIsVisible = await notificationButton.isVisible();

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }
    
    const productCount = await cartPage.getProductList.count();
    expect(productCount).toBe(1);
    await expect(cartPage.getProductItemCount).toHaveValue('2');
  })

  test('M | Pusta szuflada koszyka otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('471');

    await expect(cartPage.getCartDrawerButton).toBeVisible({ timeout: 15000 });
    await cartPage.clickCartDrawerButton();

    await expect(cartPage.getCartDrawer).toBeVisible();

    await expect(cartPage.getCartDrawerCloseIconButton).toBeVisible();

    await expect(cartPage.getClearCartButton).toBeVisible();
    await expect(cartPage.getClearCartButton).toBeDisabled();
    await expect(cartPage.getClearCartButton).toHaveText('Wyczyść koszyk');

    await expect(cartPage.getEmptyCartDrawerNotification).toBeVisible();
    await expect(cartPage.getEmptyCartDrawerNotification).toHaveText('Twój koszyk jest pusty');

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible();
    await expect(cartPage.getCartAvailableCodesButton).toContainText('Sprawdź dostępne kody rabatowe:');
    
    await expect(cartPage.getCartDrawerToCartButton).toBeVisible();
    await expect(cartPage.getCartDrawerToCartButton).toHaveText('Do kasy');
  })

  test('M | Szuflada koszyka zamyka się po kliknięciu ikonki "X"', async ({ page }) => {
    
    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('472');

    await expect(cartPage.getCartDrawer).toBeHidden();
    await cartPage.clickCartDrawerButton();
    await expect(cartPage.getCartDrawer).toBeVisible();
    await cartPage.clickCloseDrawerIconButton();
    await expect(cartPage.getCartDrawer).toBeHidden();
  })

  test('M | Możliwość przejścia do koszyka z szuflady koszyka', async ({ page, baseURL, addProduct }) => {

    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('469');
    
    const product = 'woda';

    await addProduct(product);
    await cartPage.clickCartDrawerButton();
    await expect(cartPage.getCartDrawerToCartButton).toBeEnabled();
    await cartPage.getCartDrawerToCartButton.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
  })

  test('M | Możliwość przejścia z koszyka do strony głównej przyciskiem "Cofnij"', async ({ page, baseURL }) => {
    
    await allure.tags('Mobilne', 'Koszyk');
    await allure.epic('Mobilne');
    await allure.parentSuite('Koszyk');
    await allure.suite('Testy koszyka');
    await allure.subSuite('');
    await allure.allureId('474');
    
    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await expect(cartPage.getCartReturnButton).toBeVisible();
    await cartPage.getCartReturnButton.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(`${baseURL}`);
    await expect(mainPage.getBannersSection).toBeVisible();
  })

  test.describe('M | Możliwość dodania do koszyka najczęściej kupowanych produktów', async () => {

    test.setTimeout(80000);
    
    test('M | Możliwość dodania do koszyka wody', async ({ page, addProduct }) => {
      
      await allure.tags('Mobilne', 'Koszyk');
      await allure.epic('Mobilne');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('468');

      const product = 'woda';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);

      const productBrand = (await page.locator(selectors.ProductsListPage.mobile.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartListName);

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('woda');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator('..').locator('..').locator(selectors.CartPage.mobile.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })

    test('M | Możliwość dodania do koszyka bułki', async ({ page, addProduct }) => {

      await allure.tags('Mobilne', 'Koszyk');
      await allure.epic('Mobilne');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('470');
      
      const product = 'bułka kajzerka putka';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.mobile.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartListName);

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('bułka');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator('..').locator('..').locator(selectors.CartPage.mobile.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })

    test('M | Możliwość dodania do koszyka banana', async ({ page, addProduct }) => {
      
      await allure.tags('Mobilne', 'Koszyk');
      await allure.epic('Mobilne');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('473');

      const product = 'banan zieleniak';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.mobile.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartListName);

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('banan');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator('..').locator('..').locator(selectors.CartPage.mobile.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })
    
    test('M | Możliwość dodania do koszyka serka wiejskiego', async ({ page, addProduct }) => {
      
      await allure.tags('Mobilne', 'Koszyk');
      await allure.epic('Mobilne');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Możliwość dodania do koszyka najczęściej kupowanych produktów');
      await allure.allureId('476');

      const product = 'serek wiejski piątnica';
      const addedProduct: { name: string; price: string }[] = [];

      await addProduct(product);
    
      const productBrand = (await page.locator(selectors.ProductsListPage.mobile.productCardBrand).first().innerText()).toUpperCase();
      const productPrice = (await page.locator(selectors.Searchbar.common.searchbarProductPrice.replace(/[\s\u200B]+$/, '')).first().innerText());
      addedProduct.push({ name: productBrand, price: productPrice });
    
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartListName);

      const cartItems = await page.locator(selectors.CartPage.common.productCartList).all();
    
      const cartItem = cartItems[0];

      const cartProductBrand = await cartItem.locator(selectors.CartPage.common.productCartListName).innerText();
      const cartProductName = (await cartItem.locator(selectors.CartPage.common.productCartListName).innerText()).toLowerCase();
      const firstWordInCart = cartProductBrand.split(' ')[0].toUpperCase();
      
      expect(cartProductName).toContain('serek wiejski');
      expect(firstWordInCart).toContain(addedProduct[0].name.split(' ')[0]);
      await page.waitForTimeout(1000);

      const cartProductPrice = await cartItem.locator('..').locator('..').locator(selectors.CartPage.mobile.productCartListPrice).innerText();
      
      const formattedCartProductPrice = cartProductPrice.replace(/\s+/g, '').replace(/\,+/g, '.');;
      const expectedPrice = addedProduct[0].price.replace(/\s+/g, '').replace(/\,+/g, '.');

      const formattedCartProductPriceMatches: string[] = formattedCartProductPrice.match(/\b\d+([.]\d+)?zł/g) || [];
      const expectedPriceMatches: string[] = expectedPrice.match(/\b\d+([.]\d+)?zł/g) || [];

      const sortedCartPrices = formattedCartProductPriceMatches.sort();
      const sortedExpectedPrices = expectedPriceMatches;

      expect(sortedCartPrices).toEqual(sortedExpectedPrices);
    })
  })

  test.describe('Kody rabatowe', async () => {

    test('M | Możliwość dodania kodu rabatowego do koszyka i jego usunięcia', async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Koszyk');
      await allure.epic('Mobilne');
      await allure.parentSuite('Koszyk');
      await allure.suite('Testy koszyka');
      await allure.subSuite('Kody rabatowe');
      await allure.allureId('2329');

      await addProduct('do mycia naczyń somat');
      await searchbarPage.getProductItemCount.click();
      await searchbarPage.getProductItemCount.type('1');
      await commonPage.getCartButton.click();

      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

      await expect(cartPage.getSummaryExpandButton).toBeVisible();
      await cartPage.getSummaryExpandButton.click();

      await expect(cartPage.getCartAvailableCodesButton).toBeVisible({ timeout: 15000});

      const totalSummaryValue = await cartPage.getTotalSummaryValue.last().textContent();

      const totalSummaryValueFormatted = totalSummaryValue?.slice(10, -3) || ''
      console.log('Total summary value przed kodem:', totalSummaryValueFormatted);

      await cartPage.getCartAvailableCodesButton.click();

      await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(1000);

      const codeCardColor = await cartPage.getCartCodesDrawer.last().locator('div[data-sentry-element="RebateCodeActionsWrapper"]').first().evaluate((el) => window.getComputedStyle(el).backgroundColor);
      const codeCardDiscountValue = await cartPage.getCartCodesDrawer.last().locator('div[data-sentry-element="RebateCodeActionsWrapper"] div').first().textContent() || '';
      const codeCardButton = cartPage.getCartCodesDrawer.last().locator('div[data-sentry-element="RebateCodeActionsWrapper"] button').first();
      const codeCardInformation = cartPage.getCartCodesDrawer.last().locator('div[data-sentry-element="RebateCodeActionsWrapper"] span').first();
      const codeCardName = await cartPage.getCartCodesDrawer.last().locator('div[data-sentry-element="RebateCodeDescriptionWrapper"] p').first().textContent();

      const codeCardDiscountValueFormatted = codeCardDiscountValue.slice(0, -2) + ',00 zł';
      const codeCardNameFormatted = codeCardName?.slice(14);

      expect(codeCardColor).toBe('rgb(97, 189, 78)')
      expect(codeCardButton).toBeVisible();
      expect(codeCardInformation).toHaveText('Możliwy do zrealizowania');

      console.log(codeCardDiscountValueFormatted);
      console.log(codeCardName);

      await codeCardButton.click();
      await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(2000);

      const codeTitle = (await cartPage.getActiveDiscountCodesTitle.locator('..').last().first().locator('b').textContent());
      expect(codeTitle).toContain(codeCardNameFormatted);

      const codeDiscountValue = (await cartPage.getActiveDiscountCodesTitle.locator('..').last().last().locator('span').textContent());
      if (codeDiscountValue !== null) {
        const cleanCodeDiscountValue = codeDiscountValue.replace(/\s+/g, '');
        const cleanCodeCardDiscountValueFormatted = codeCardDiscountValueFormatted.replace(/\s+/g, '');
        expect(cleanCodeDiscountValue).toContain(cleanCodeCardDiscountValueFormatted);
      } else {
        throw new Error('codeDiscountValue is null');
      }

      const discountCodeSummaryValue = await cartPage.getDiscountCodesTitle.locator('..').last().textContent();
      if (discountCodeSummaryValue !== null) {
        const cleanDiscountCodeSummaryValueFormatted = codeCardDiscountValueFormatted.replace(/\s+/g, ' ');
        expect(cleanDiscountCodeSummaryValueFormatted).toContain(codeCardDiscountValueFormatted);
      } else {
        throw new Error('codeDiscountValue is null');
      }

      const codeCardDiscountValueFormattedParsed = parseFloat(codeCardDiscountValueFormatted.slice(1, -2).replace(',', '.'));
      console.log('codeCardDiscountValueFormattedParsed:', codeCardDiscountValueFormattedParsed);

      const totalSummaryValueFormattedParsed = parseFloat(totalSummaryValueFormatted.replace(',', '.'));
      console.log('totalSummaryValueFormattedParsed:', totalSummaryValueFormattedParsed);

      const totalSummaryValueAfterDiscount = await cartPage.getTotalSummaryValue.last().textContent();
      console.log('totalSummaryValueAfterDiscount:', totalSummaryValueAfterDiscount);

      const totalSummaryValueAfterDiscountFormatted = totalSummaryValueAfterDiscount?.slice(10, -3) || ''
      console.log('totalSummaryValueAfterDiscountFormatted:', totalSummaryValueAfterDiscountFormatted);

      const totalSummaryValueAfterDiscountFormattedParsed = parseFloat(totalSummaryValueAfterDiscountFormatted.replace(/\s+/g, '').replace(',', '.'));
      console.log('totalSummaryValueAfterDiscountFormattedParsed:', totalSummaryValueAfterDiscountFormattedParsed);

      const discountValue = totalSummaryValueFormattedParsed - totalSummaryValueAfterDiscountFormattedParsed;
      console.log('Różnica wartości:', discountValue);
      expect(discountValue).toBe(codeCardDiscountValueFormattedParsed);

      await expect(cartPage.getSummaryDeleteDiscountCodeButton).toBeVisible();
      await cartPage.getSummaryDeleteDiscountCodeButton.click();
      await expect(cartPage.getSummaryDeleteDiscountCodeButton).not.toBeVisible({ timeout: 5000 });
      await expect(cartPage.getActiveDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });
      await expect(cartPage.getDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });

      const totalSummaryValueAfterDeleteCode = await cartPage.getTotalSummaryValue.last().textContent();
      console.log('totalSummaryValueAfterDeleteCode:', totalSummaryValueAfterDeleteCode);
      const totalSummaryValueAfterDeleteCodeFormatted = totalSummaryValueAfterDeleteCode?.slice(10, -3) || ''
      console.log('totalSummaryValueAfterDeleteCodeFormatted:', totalSummaryValueAfterDeleteCodeFormatted);
      const totalSummaryValueAfterDeleteCodeFormattedParsed = parseFloat(totalSummaryValueAfterDeleteCodeFormatted.replace(/\s+/g, '').replace(',', '.'));
      console.log('totalSummaryValueAfterDeleteCodeFormattedParsed:', totalSummaryValueAfterDeleteCodeFormattedParsed);
      expect(totalSummaryValueAfterDeleteCodeFormattedParsed).toBe(totalSummaryValueFormattedParsed);
    })
  })
})