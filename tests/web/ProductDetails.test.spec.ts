import { expect } from '@playwright/test';
import ProductDetailsPage from '../../page/ProductDetails.page.ts';
import ProductsListPage from "../../page/ProductsList.page.ts";
import SearchbarPage from '../../page/Searchbar.page.ts';
import CommonPage from '../../page/Common.page.ts';
import CartPage from '../../page/Cart.page.ts';
import * as utility from '../../utils/utility-methods';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';

test.describe('Testy szczegółów produktu', async () => {

  let productDetailsPage: ProductDetailsPage;
  let productsListPage: ProductsListPage;
  let searchbarPage: SearchbarPage;
  let commonPage: CommonPage;
  let cartPage: CartPage;

  const productToSearchName = 'woda mineralna szkło'

  test.beforeEach(async ({ page }) => {

    productDetailsPage = new ProductDetailsPage(page);
    productsListPage = new ProductsListPage(page);
    searchbarPage = new SearchbarPage(page);
    commonPage = new CommonPage(page);
    cartPage = new CartPage(page);

    await page.goto('/', { waitUntil: 'load' });

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test.afterEach(async ({ clearCartViaAPI }) => {
    
    await cartPage.clickCartDrawerButton();
    await clearCartViaAPI();
  }) 

  test('W | Strona produktu otwiera się ze wszystkimi wymaganymi polami', async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('x');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();

    const productBrandName = await searchbarPage.getSearchbarProductBrandNames.first().allTextContents();
    console.log('productBrandName', productBrandName)

    const productName = await searchbarPage.getSearchbarProductNames.first().allTextContents();
    console.log('productName', productName)

    const productGrammar = await searchbarPage.getSearchbarProductGrammars.first().allTextContents();
    console.log('productGrammar', productGrammar)

    const productPricePerGrammar = await searchbarPage.getSearchbarProductPricePerGrammar.first().allTextContents();
    console.log('productPricePerGrammar', productPricePerGrammar)

    const productPrice = await searchbarPage.getProductPrices.first().allTextContents();
    console.log('productPrice', productPrice)

    const productSetFirstQuantityButton = await page.locator('div[data-testid="search-results"] div[data-sentry-element="ProductSets"] button').first().allTextContents();
    console.log('pierwszy przycisk do ilosci', productSetFirstQuantityButton)

    const productSetSecondQuantityButton = await page.locator('div[data-testid="search-results"] div[data-sentry-element="ProductSets"] button').nth(1).allTextContents();
    console.log('drugi przycisk do ilosci', productSetSecondQuantityButton)

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click();

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const newProductBrandName = await productDetailsPage.getProductBrandNames.first().allTextContents();
    console.log('newProductBrandName', newProductBrandName)
    const newProductName = await productDetailsPage.getProductNames.first().allTextContents();
    console.log('newProductName', newProductName)
    const newProductGrammar = await productDetailsPage.getProductGrammar.first().allTextContents();
    console.log('newProductGrammar', newProductGrammar)
    const newProductPricePerGrammar = await productDetailsPage.getProductPricePerGrammar.first().allTextContents();
    console.log('newProductPricePerGrammar', newProductPricePerGrammar)
    const newProductPrice = await productDetailsPage.getProductPrice.allTextContents();
    console.log('newProductPrice', newProductPrice)
    const productNewSetFirstQuantityButton = await productDetailsPage.getSetFirstQuantityButton.allTextContents();
    console.log('new Pierwszy przycisk do ilosci', productNewSetFirstQuantityButton)
    const productNewSetSecondQuantityButton = await productDetailsPage.getSetSecondQuantityButton.allTextContents();
    console.log('new Drugi przycisk do ilosci', productNewSetSecondQuantityButton)

    const formattedNewProductPrice = newProductPrice[0].replace(/\s+/g, '');
    const formattedProductPrice = productPrice[0].replace(/\s+/g, '');
    const formattedNewProductSetFirstQuantityButton = productNewSetFirstQuantityButton[0].replace(/\s+/g, '');
    const formattedNewProductSetSecondQuantityButton = productNewSetSecondQuantityButton[0].replace(/\s+/g, '');
    
    expect(newProductBrandName).toEqual(productBrandName);
    expect(newProductName[0]).toContain(productName[0]);
    expect(newProductGrammar).toEqual(productGrammar);
    expect(newProductPricePerGrammar).toEqual(productPricePerGrammar);
    expect(formattedNewProductPrice).toContain(formattedProductPrice);
    expect(productSetFirstQuantityButton[0]).toEqual(formattedNewProductSetFirstQuantityButton); // Change wen KAN-1114 is done
    expect(productSetSecondQuantityButton[0]).toEqual(formattedNewProductSetSecondQuantityButton); // Change wen KAN-1114 is done

    await expect(productDetailsPage.getProductActualPriceTitle).toBeVisible();
    await expect(productDetailsPage.getAddProductButton).toBeVisible();
    await expect(productDetailsPage.getMainInfoProductDropdown).toBeVisible();
    await expect(productDetailsPage.getNutritionalValuesInfoDropdown).toBeVisible();
    await expect(productDetailsPage.getStorageInfoDropdown).toBeVisible();
    await expect(productDetailsPage.getPackagingInfoDropdown).toBeVisible();
    await expect(productDetailsPage.getProductDescriptionTitle).toBeVisible();
    await expect(productDetailsPage.getOtherProductsFromThisCategorySection).toBeVisible();
    await expect(productDetailsPage.getOtherProductsFromThisCategorySectionTitle).toBeVisible();
    await expect(productDetailsPage.getSectionShowAllLink).toBeVisible();
  })
  
  test('W | Możliwość dodania jednej sztuki produktu do koszyka', async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('x');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click();

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productPrice = await productDetailsPage.getProductPrice.first().textContent();
    console.log('prodprice', productPrice);

    const formattedProductPrice = productPrice?.slice(0, -7);

    console.log('formatedprodprice', formattedProductPrice);

    await expect(productDetailsPage.getSetFirstQuantityButton.locator('svg')).toHaveAttribute('class', 'tabler-icon tabler-icon-check');
    await productDetailsPage.clickAddProductButton();

    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');
    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    await expect(commonPage.getCartProductsCount).toHaveText('1');
    await expect(commonPage.getCartProductsPrice).toHaveText(formattedProductPrice || '');
  })
      
  test('W | Możliwość dodania wielosztuk produktu do koszyka', async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('x');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click();

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const secondQuantityButtonText = await productDetailsPage.getSetSecondQuantityButton.textContent();
    console.log('secondQuantityButtonText', secondQuantityButtonText);
    const formattedSecondQuantityButtonText = secondQuantityButtonText?.slice(0, -5);

    console.log('formattedSecondQuantityButtonText', formattedSecondQuantityButtonText);

    await productDetailsPage.getSetSecondQuantityButton.click();
    await expect(productDetailsPage.getSetSecondQuantityButton.locator('svg')).toHaveAttribute('class', 'tabler-icon tabler-icon-check');
    
    const productPrice = await productDetailsPage.getProductPrice.first().textContent();
    console.log('prodprice', productPrice);

    let formattedProductPrice: string | undefined = '';

    if (productPrice) {
        if (secondQuantityButtonText) {
            formattedProductPrice = secondQuantityButtonText.length > 6
            ? productPrice.slice(0, -9) : productPrice.slice(0, -8);
        } else {
            formattedProductPrice = productPrice;
        }
    }

    console.log('formatedprodprice', formattedProductPrice);

    await productDetailsPage.clickAddProductButton();

    await expect(productDetailsPage.getProductItemCount).toHaveValue(formattedSecondQuantityButtonText || '');
    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    await expect(commonPage.getCartProductsCount).toHaveText('1');
    await expect(commonPage.getCartProductsPrice).toHaveText(formattedProductPrice || '');
  })
        
  test('W | Możliwość zmniejszenia ilości produktu z poziomu szczegółów produktu', async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('x');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click();

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    await productDetailsPage.clickAddProductButton();

    await page.waitForTimeout(1000);

    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await productDetailsPage.getIncreaseProductButton.click();
      await page.waitForTimeout(1000);
    }
    
    await expect(productDetailsPage.getProductItemCount).toHaveValue('3');

    for (let i = 0; i < 2; i++) {
      await productDetailsPage.getDecreaseProductButton.click();
      await page.waitForTimeout(1000);
    }
    
    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');
  })
     
  test('W | Możliwość usunięcia produktu z poziomu szczegółów produktu', async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('x');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click();

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    await productDetailsPage.clickAddProductButton();

    await page.waitForTimeout(1000);

    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');

    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();
    
    await productDetailsPage.getDecreaseProductButton.click();

    await expect(productDetailsPage.getDeleteProductModal).toBeVisible({ timeout: 5000 });
    await expect(productDetailsPage.getConfirmDeleteModalButton).toBeVisible();
    await productDetailsPage.getConfirmDeleteModalButton.click();

    await expect(productDetailsPage.getDeleteProductModal).not.toBeVisible({ timeout: 5000 });
    await expect(productDetailsPage.getAddProductButton).toBeVisible({ timeout: 5000 });
    await expect(productDetailsPage.getIncreaseProductButton).not.toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).not.toBeVisible();

  })
})

