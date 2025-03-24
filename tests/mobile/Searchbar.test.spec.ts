import { expect } from '@playwright/test';
import SearchbarPage from '../../page/Searchbar.page.ts';
import ProductsPage from '../../page/Products.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe('Testy wyszukiwarki', async () => {

  let searchbarPage: SearchbarPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    searchbarPage = new SearchbarPage(page);
    productsPage = new ProductsPage(page);
  })

  test('M | Po kliknięciu w wyszukiwarkę wyświetlają się wszystkie wymagane pola', async ({ page }) => {

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await expect(searchbarPage.getOurDiscountsTitle).toBeVisible();
    await expect(searchbarPage.getSectionShowAllLink).toBeVisible();
    await expect(searchbarPage.getOurDiscountsSection).toBeVisible();
  })

  test('M | Możliwość zamknięcia wyszukiwarki przyciskiem "Zamknij"', async () => {

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await expect(searchbarPage.getOurDiscountsTitle).toBeVisible();
    await expect(searchbarPage.getSectionShowAllLink).toBeVisible();
    await expect(searchbarPage.getOurDiscountsSection).toBeVisible();

    await searchbarPage.getSearchbarCloseButton.click();
    await expect(searchbarPage.getSearchbarCloseButton).not.toBeVisible({ timeout: 10000 });

    await expect(searchbarPage.getOurDiscountsTitle).not.toBeVisible();
    await expect(searchbarPage.getSectionShowAllLink).not.toBeVisible();
    await expect(searchbarPage.getOurDiscountsSection).not.toBeVisible();
  })
  
  test('M | Wyszukanie nieistniejącego produktu', async ({ page }) => {

    const notExistingProduct = 'nieistniejacyprodukt';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(notExistingProduct);
    await expect(page.getByText(`Brak wyników wyszukiwania dla '${notExistingProduct}'`)).toBeVisible();
  })

  test('M | Produkt wpisany dużymi literami powinien się prawidłowo wyszukać', async ({ page }) => {

    const productToSearch = 'MANGO';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(4, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
  
  test('M | Produkt wpisany małymi literami powinien się prawidłowo wyszukać', async ({ page }) => {

    const productToSearch = 'mango';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(4, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
    
  test('M | Produkt wpisany małymi i dużymi literami powinien się prawidłowo wyszukać', async ({ page }) => {

    const productToSearch = 'manGO';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(4, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
  
  test('M | Możliwość wyczyszczenia wyszukiwarki', async ({ page }) => {

    const productToSearch = 'mango';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarInput).toHaveValue(productToSearch);
    await expect(searchbarPage.getSearchbarClearButton).toBeVisible();
    const firstSearchedProduct = await searchbarPage.getSearchbarProductTiles.first().locator('h3').textContent();
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });
    expect(firstSearchedProduct?.toLowerCase()).toContain(productToSearch.toLowerCase());

    await searchbarPage.getSearchbarClearButton.click();
    await expect(searchbarPage.getSearchbarInput).not.toHaveValue(productToSearch);
    await expect(searchbarPage.getSearchbarClearButton).not.toBeVisible();
    await expect(searchbarPage.getSearchbarProductTiles.first()).not.toBeVisible({ timeout: 5000 })
  })
  
  test('M | Produkt wyszukiwany ze spacjami na początku prawidłowo się wyszukuje', async ({ page }) => {

    const productToSearch = '   mango';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(4, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain('mango');
    }
  })
  
  test('M | Możliwość wyszukania produktów po nazwie marki', async ({ page }) => {

    const brandToSearch = 'zieleniak';

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await page.keyboard.type(brandToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(4, resultsCount); i++) {
      const brandName = await searchResults.nth(i).locator('h4').textContent();
      expect(brandName?.toLowerCase()).toContain(brandToSearch);
    }
  })
    
  test('M | Możliwość przwijania slidera nasze promocje', async () => {

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });

    await expect(searchbarPage.getOurDiscountsSection).toBeVisible();

    const firstItemInSlider = searchbarPage.getOurDiscountsSection.locator('div').locator('div').locator('div').locator('div').locator('div').first()

    await searchbarPage.getSliderLeftButton.isDisabled();
    await searchbarPage.getSliderRightButton.click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await searchbarPage.getSliderLeftButton.isEnabled();
    await searchbarPage.getSliderLeftButton.click();
    await expect(firstItemInSlider).toBeInViewport();
    await searchbarPage.getSliderLeftButton.isDisabled();
  })

  test('M | Możliwość przejścia do naszych promocji poprzez link slidera', async ({ page, baseURL}) => {

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
    await expect(searchbarPage.getOurDiscountsSection).toBeVisible();
    await searchbarPage.getSectionShowAllLink.click();
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(productsPage.getProductCategoryTitle('Promocje')).toBeVisible({ timeout: 15000 });
  })
})

