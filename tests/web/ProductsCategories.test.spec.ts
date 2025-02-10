import { expect } from '@playwright/test';
import ProductsCategoriesPage from "../../page/ProductsCategories.page";
import ProductsPage from "../../page/Products.page.ts";
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';

test.describe('Testy kategorii produktów', async () => {

  let productsCategoriesPage: ProductsCategoriesPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await loginManual();
    await page.goto('/kategorie', { waitUntil: 'load' });

    productsCategoriesPage = new ProductsCategoriesPage(page);
    productsPage = new ProductsPage(page);
  })

  test('W | Strona kategorii produktów wyświetla się ze wszystkimi wymaganymi polami', async () => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('823');

    await expect(productsCategoriesPage.getProductsCategoriesTitle).toBeVisible();
    const tilesCount = await productsCategoriesPage.getProductsCategoriesTiles.count();

    // Add assert for breadrcrumbs after done task KAN-879

    expect(tilesCount).toBeGreaterThan(16);
  })

  test('W | Możliwość przejścia do wybranej kategorii produktów', async ({ page }) => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('824');

    const warzywaOwoceLink = page.locator('a[href="/warzywa-i-owoce"]').last();

    expect(warzywaOwoceLink).toContainText('Zobacz wszystkie');

    await warzywaOwoceLink.click();

    await expect(page).toHaveURL('/warzywa-i-owoce');

    await expect(productsPage.getProductCategoryTitle('Warzywa i owoce')).toBeVisible();
  })

  test('W | Możliwość przejścia do wybranej podkategorii danej kategorii', async ({ page }) => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('825');

    const warzywaOwoceSubCategoryLink = page.locator('a[href="/warzywa-i-owoce/owoce"] h3');

    expect(warzywaOwoceSubCategoryLink).toContainText('Owoce');

    await warzywaOwoceSubCategoryLink.click();

    await expect(page).toHaveURL('/warzywa-i-owoce/owoce');

    await expect(productsPage.getProductCategoryTitle('Owoce')).toBeVisible();
  })
})

