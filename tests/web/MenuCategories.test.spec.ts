import { expect } from '@playwright/test';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import ProductsPage from '../../page/Products.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';

test.describe('Testy menu kategorii', async () => {

  let menuCategoriesPage: MenuCategoriesPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await loginManual();

    menuCategoriesPage = new MenuCategoriesPage(page);
    productsPage = new ProductsPage(page);
  })

  test('W | Menu kategorii otwiera się z obecnymi kategoriami', async () => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1024');

    await menuCategoriesPage.clickMenuCategoriesButton();
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await menuCategoriesPage.getMenuCategories.count();

    expect(categoriesCount).toBeGreaterThan(18);
  })

  test('W | Możliwość zamknięcia menu', async ({ page }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1025');

    await menuCategoriesPage.clickMenuCategoriesButton();
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await menuCategoriesPage.getMenuCategories.count();

    expect(categoriesCount).toBeGreaterThan(18);

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.waitForSelector('div[maxdepth="4"]', { timeout: 5000, state: 'hidden' });

    await expect(menuCategoriesPage.getMenuCategories.locator('..')).not.toBeVisible();
  })

  /*test.skip('W | Menu przykładowej kategorii otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {
  })*/

  test('W | Możliwość przejścia do kategorii produktów', async ({ page, baseURL }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1026');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.getByText('Warzywa i owoce').click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce');
    await productsPage.getProductCategoryTitle('Warzywa i owoce').isVisible();
  })

  test('W | Możliwość przejścia do podkategorii produktów', async ({ page, baseURL }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1027');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.getByText('Warzywa i owoce').hover();
    await page.getByText('Grzyby').click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce/grzyby');
    await productsPage.getProductCategoryTitle('Grzyby').isVisible();
  })
})

