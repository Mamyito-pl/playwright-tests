import { expect } from '@playwright/test';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import ProductsPage from '../../page/Products.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe('Testy menu kategorii', async () => {

  let menuCategoriesPage: MenuCategoriesPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

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
    await expect(menuCategoriesPage.getMenuCategories.locator('..').locator('..')).toBeVisible();

    const categoriesCount = await menuCategoriesPage.getMenuCategories.locator('div').locator('div').locator('div').count();

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

    const categoriesCount = await menuCategoriesPage.getMenuCategories.locator('div').locator('div').locator('div').count();

    expect(categoriesCount).toBeGreaterThan(18);

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.waitForSelector('div[maxdepth="4"]', { timeout: 5000, state: 'hidden' });

    await expect(menuCategoriesPage.getMenuCategories.locator('..').locator('..')).not.toBeVisible();
  })

  test('W | Menu przykładowej kategorii otwiera się ze wszystkimi potrzebnymi polami', async ({ page }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1028');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.getByText('Warzywa i owoce').hover();

    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryTitleWeb).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryTitleWeb).toHaveText('Warzywa i owoce');
  })

  test('W | Możliwość przejścia do kategorii produktów', async ({ page, baseURL }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1026');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.getByText('Warzywa i owoce').click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce', { timeout: 10000 });
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

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce/grzyby', { timeout: 10000 });
    await productsPage.getProductCategoryTitle('Grzyby').isVisible();
  })
})

