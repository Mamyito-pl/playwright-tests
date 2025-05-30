import { expect } from '@playwright/test';
import OrdersPage from '../../../page/Profile/OrdersList.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';

test.describe('Testy listy zamówień', async () => {

  let ordersPage: OrdersPage;
  
  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    ordersPage = new OrdersPage(page);
  })
  
  test('M | Strona zamówień wyświetla się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy listy zamówień');
    await allure.subSuite('');
    await allure.allureId('1937');

    let orderTotal: string | undefined;

    page.on('response', async response => {
      const url = response.url();
      if (url.includes(`${process.env.APIURL}/api/sale-orders`) && response.ok()) {
        const responseData = await response.json();
        orderTotal = responseData.meta.total.toString();
      }
    });

    await page.goto('/profil/zamowienia', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia');
    await expect(ordersPage.getOrdersTitle).toBeVisible({ timeout: 15000 });
    await expect(ordersPage.getOrdersTotal).toContainText(orderTotal || '');
    await expect(ordersPage.getOrderDetailsButton.first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Nr zamówienia').nth(1)).toBeVisible();
    await expect(page.getByText('Data zamówienia').nth(1)).toBeVisible();
    await expect(page.getByText('Suma').nth(1)).toBeVisible();
  })
})
