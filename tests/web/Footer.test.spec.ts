import { expect } from '@playwright/test';
import FooterPage from "../../page/Footer.page.ts";
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe('Testy stopki', async () => {

  let footerPage: FooterPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    footerPage = new FooterPage(page);
  })

  test('W | Stopka wyświetla się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Stopka');
    await allure.epic('Webowe');
    await allure.parentSuite('Stopka');
    await allure.suite('Testy stopki');
    await allure.subSuite('');
    await allure.allureId('1901');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(700);

    expect(await footerPage.getSectionTitle('Dostawa')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Obszary dostawy')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Terminy dostawy')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Koszty dostawy')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Metody płatności')).toBeVisible();

    expect(await footerPage.getSectionTitle('Informacje')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Jakość i bezpieczeństwo')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Pytania i odpowiedzi')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Regulamin')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Regulaminy promocji')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Polityka prywatności')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Odstąpienie od umowy')).toBeVisible();

    expect(await footerPage.getSectionTitle('Mamyito')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('O nas')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Blog')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Współpraca')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('Kariera')).toBeVisible();

    expect(await footerPage.getSectionTitle('Kontakt')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink(' +48 22 299 20 23')).toBeVisible();
    expect(await footerPage.getFooterSubTitleLink('bok@mamyito.pl')).toBeVisible();
    await expect(footerPage.getFooterOpeninHoursInfo).toBeVisible();
  })
})

