import { expect } from '@playwright/test';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';
import RebateCodesPage from '../../../page/Profile/RebateCodes.page.ts';

test.describe('Testy kodów rabatowych', async () => {

  let rebateCodesPage: RebateCodesPage;
  
  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    rebateCodesPage = new RebateCodesPage(page);
  })
  
  test('W | Strona kodów rabatowych wyświetla się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy kodów rabatowych');
    await allure.subSuite('');
    await allure.allureId('2566');

    await page.goto('/profil/kody-rabatowe', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/profil/kody-rabatowe');
    await expect(rebateCodesPage.getRebateCodesTitle).toBeVisible({ timeout: 15000 });

    await expect(rebateCodesPage.getRebateCodesAllFilterButton).toBeVisible({ timeout: 5000 });
    await expect(rebateCodesPage.getRebateCodesNotUsedFilterButton).toBeVisible({ timeout: 5000 });
    await expect(rebateCodesPage.getRebateCodesUsedFilterButton).toBeVisible({ timeout: 5000 });
    await expect(rebateCodesPage.getRebateCodesNotActiveFilterButton).toBeVisible({ timeout: 5000 });
  })
})
