import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures.ts';
import LoginPage from "../../page/Login.page";
import CommonPage from "../../page/Common.page";
import SearchbarPage from '../../page/Searchbar.page';
import CartPage from '../../page/Cart.page';
import DeliveryPage from '../../page/Delivery.page';
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';
import * as selectors from '../../utils/selectors.json';

test.describe.configure({ mode: 'serial' });

test.describe('Testy kodów rabatowych', async () => {

  test.setTimeout(80000);

  let loginPage: LoginPage;
  let commonPage: CommonPage;
  let searchbarPage: SearchbarPage;
  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let product = 'janex polędwica wołowa'

  test.beforeEach(async ({ page }) => {

    loginPage = new LoginPage(page);
    commonPage = new CommonPage(page);
    searchbarPage = new SearchbarPage(page);
    cartPage = new CartPage(page);
    deliveryPage = new DeliveryPage(page);
    await page.goto('/', { waitUntil: 'load' });
    
    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test.afterEach(async ({ clearCartViaAPI }) => {
    
    await clearCartViaAPI();
  }) 
  
  test('M | Możliwość dodania kodu rabatowego do koszyka i jego usunięcia', { tag: ['@ProdSmoke'] }, async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Kody rabatowe');
    await allure.epic('Mobilne');
    await allure.parentSuite('Kody rabatowe');
    await allure.suite('Testy kodów rabatowych');
    await allure.subSuite('Kody rabatowe');
    await allure.allureId('2329');

    await addProduct(product);
    await searchbarPage.getProductItemCount.click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible({ timeout: 15000});

    await cartPage.getCartExpandCollapseButton.click({ force: true, delay: 300 });

    const totalSummaryValue = await cartPage.getTotalSummaryValue.last().textContent();

    const totalSummaryValueFormatted = totalSummaryValue?.slice(10, -3) || ''
    console.log('Total summary value przed kodem:', totalSummaryValueFormatted);

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    const codeCardColor = await cartPage.getCartCodesDrawer.last().first().locator('div[data-cy="rebate-code-value-wrapper"]').first().evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const codeCardDiscountValue = await cartPage.getCartCodesDrawer.last().first().locator('div[data-cy="rebate-code-value-wrapper"] div').first().textContent() || '';
    const codeCardButton = cartPage.getCartCodesDrawer.last().first().locator('div[data-cy="rebate-code-actions-wrapper"] button').first();
    const codeCardInformation = cartPage.getCartCodesDrawer.last().first().locator('div[data-cy="rebate-code-value-wrapper"] span').first();
    const codeCardName = await cartPage.getCartCodesDrawer.last().first().locator('div[data-cy="rebate-code-description-wrapper"] div').first().textContent();

    const codeCardDiscountValueFormatted = codeCardDiscountValue.slice(1, -2) + ',00 zł';

    expect(codeCardColor).toBe('rgb(97, 189, 78)')
    expect(codeCardButton).toBeVisible();
    expect(codeCardInformation).toHaveText('Możliwy do zrealizowania');

    console.log('codeCardDiscountValueFormatted:',codeCardDiscountValueFormatted);
    console.log(codeCardName);

    await codeCardButton.click();
    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(2000);

    await expect(cartPage.getActiveCodeValue).toBeVisible({ timeout: 5000 });
    const codeDiscountValue = (await cartPage.getActiveCodeValue.textContent());
    if (codeDiscountValue !== null) {
      const cleanCodeDiscountValue = codeDiscountValue.replace(/\s+/g, '').slice(0, -6);
      const cleanCodeCardDiscountValueFormatted = codeCardDiscountValueFormatted.replace(/\s+/g, '');
      console.log(cleanCodeDiscountValue);
      console.log(cleanCodeCardDiscountValueFormatted);
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

    const codeCardDiscountValueFormattedParsed = parseFloat(codeCardDiscountValueFormatted.slice(0, -2).replace(',', '.'));
    console.log('codeCardDiscountValueFormattedParsed:', codeCardDiscountValueFormattedParsed);

    const totalSummaryValueFormattedParsed = parseFloat(totalSummaryValueFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueFormattedParsed:', totalSummaryValueFormattedParsed);

    const totalSummaryValueAfterDiscount = await cartPage.getTotalSummaryValue.last().textContent();
    console.log('totalSummaryValueAfterDiscount:', totalSummaryValueAfterDiscount);

    const totalSummaryValueAfterDiscountFormatted = totalSummaryValueAfterDiscount?.slice(10, -3) || ''
    console.log('totalSummaryValueAfterDiscountFormatted:', totalSummaryValueAfterDiscountFormatted);

    const totalSummaryValueAfterDiscountFormattedParsed = parseFloat(totalSummaryValueAfterDiscountFormatted.replace(/\s/g, '').replace(',', '.'));
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
    const totalSummaryValueAfterDeleteCodeFormattedParsed = parseFloat(totalSummaryValueAfterDeleteCodeFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueAfterDeleteCodeFormattedParsed:', totalSummaryValueAfterDeleteCodeFormattedParsed);
    expect(totalSummaryValueAfterDeleteCodeFormattedParsed).toBe(totalSummaryValueFormattedParsed);
  })

  test('M | Możliwość dodania kodu rabatowego kwotowego do koszyka i jego usunięcia', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Kody rabatowe');
    await allure.epic('Mobilne');
    await allure.parentSuite('Kody rabatowe');
    await allure.suite('Testy kodów rabatowych');
    await allure.subSuite('Kody rabatowe');
    await allure.allureId('2626');

    await addProduct(product);
    
    await searchbarPage.getProductItemCount.click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible({ timeout: 15000});

    await cartPage.getCartExpandCollapseButton.click({ force: true, delay: 300 });

    const totalSummaryValue = await cartPage.getTotalSummaryValue.last().textContent();

    const totalSummaryValueFormatted = totalSummaryValue?.slice(10, -3) || ''
    console.log('Total summary value przed kodem:', totalSummaryValueFormatted);

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    const codeCardColor = await cartPage.getCartCodesDrawer.last().getByText('KK10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"]').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const codeCardDiscountValue = await cartPage.getCartCodesDrawer.last().getByText('KK10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"] div').textContent() || '';
    const codeCardButton = cartPage.getCartCodesDrawer.last().getByText('KK10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-actions-wrapper"] button');
    const codeCardInformation = cartPage.getCartCodesDrawer.last().getByText('KK10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"] span');
    const codeCardName = await cartPage.getCartCodesDrawer.last().getByText('KK10').textContent();

    const codeCardDiscountValueFormatted = codeCardDiscountValue.slice(0, -2) + ',00 zł';

    expect(codeCardColor).toBe('rgb(97, 189, 78)')
    expect(codeCardButton).toBeVisible();
    expect(codeCardInformation).toHaveText('Możliwy do zrealizowania');

    console.log(codeCardDiscountValueFormatted);
    console.log(codeCardName);

    await codeCardButton.click();
    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(2000);

    const codeDiscountValue = (await cartPage.getActiveCodeValue.textContent());
    if (codeDiscountValue !== null) {
      const cleanCodeDiscountValue = codeDiscountValue.replace(/\s+/g, '');
      const cleanCodeCardDiscountValueFormatted = codeCardDiscountValueFormatted.replace(/\s+/g, '').slice(1, -2);
      expect(cleanCodeDiscountValue).toContain(cleanCodeCardDiscountValueFormatted);
    } else {
      throw new Error('codeDiscountValue is null');
    }

    const codeCardDiscountValueFormattedParsed = parseFloat(codeCardDiscountValueFormatted.slice(1, -2).replace(',', '.'));
    console.log('codeCardDiscountValueFormattedParsed:', codeCardDiscountValueFormattedParsed);

    const totalSummaryValueFormattedParsed = parseFloat(totalSummaryValueFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueFormattedParsed:', totalSummaryValueFormattedParsed);

    const totalSummaryValueAfterDiscount = await cartPage.getTotalSummaryValue.last().textContent();
    console.log('totalSummaryValueAfterDiscount:', totalSummaryValueAfterDiscount);

    const totalSummaryValueAfterDiscountFormatted = totalSummaryValueAfterDiscount?.slice(10, -3) || ''
    console.log('totalSummaryValueAfterDiscountFormatted:', totalSummaryValueAfterDiscountFormatted);

    const totalSummaryValueAfterDiscountFormattedParsed = parseFloat(totalSummaryValueAfterDiscountFormatted.replace(/\s/g, '').replace(',', '.'));
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
    const totalSummaryValueAfterDeleteCodeFormattedParsed = parseFloat(totalSummaryValueAfterDeleteCodeFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueAfterDeleteCodeFormattedParsed:', totalSummaryValueAfterDeleteCodeFormattedParsed);
    expect(totalSummaryValueAfterDeleteCodeFormattedParsed).toBe(totalSummaryValueFormattedParsed);
  })

  test('M | Możliwość dodania kodu rabatowego procentowego do koszyka i jego usunięcia', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Kody rabatowe');
    await allure.epic('Mobilne');
    await allure.parentSuite('Kody rabatowe');
    await allure.suite('Testy kodów rabatowych');
    await allure.subSuite('Kody rabatowe');
    await allure.allureId('2627');

    await addProduct(product);
    
    await searchbarPage.getProductItemCount.click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await expect(cartPage.getCartAvailableCodesButton).toBeVisible({ timeout: 15000});

    await cartPage.getCartExpandCollapseButton.click({ force: true, delay: 300 });

    const totalSummaryValue = await cartPage.getTotalSummaryValue.last().textContent();

    const totalSummaryValueFormatted = totalSummaryValue?.slice(10, -3) || ''
    console.log('Total summary value przed kodem:', totalSummaryValueFormatted);

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    const codeCardColor = await cartPage.getCartCodesDrawer.last().getByText('KP10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"]').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const codeCardDiscountValue = await cartPage.getCartCodesDrawer.last().getByText('KP10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"] div').textContent() || '';
    const codeCardButton = cartPage.getCartCodesDrawer.last().getByText('KP10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-actions-wrapper"] button');
    const codeCardInformation = cartPage.getCartCodesDrawer.last().getByText('KP10').locator('..').locator('..').locator('..').locator('div[data-cy="rebate-code-value-wrapper"] span');
    const codeCardName = await cartPage.getCartCodesDrawer.last().getByText('KP10').textContent();

    const codeCardDiscountValueFormatted = codeCardDiscountValue.slice(1);

    expect(codeCardColor).toBe('rgb(97, 189, 78)')
    expect(codeCardButton).toBeVisible();
    expect(codeCardInformation).toHaveText('Możliwy do zrealizowania');

    console.log(codeCardName);

    await codeCardButton.click();
    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(2000);

    const codeDiscountValue = (await cartPage.getActiveCodeValue.textContent());
    const codeDiscountValueFormatted = codeDiscountValue?.slice(0, -7);

    expect(codeDiscountValueFormatted).toContain(codeCardDiscountValueFormatted);

    const discountCodeSummaryValue = (await cartPage.getDiscountCodesTitle.locator('div').last().textContent() || '').trim();
    if (discountCodeSummaryValue !== null) {
      const discountCodeSummaryValueFormatted = parseFloat(totalSummaryValueFormatted.replace(/\s/g, '').replace(',', '.')) * 0.10;
      const cleanDiscountCodeSummaryValueFormatted = '-' + discountCodeSummaryValueFormatted.toFixed(2).replace('.', ',') + ' zł';
      const normalize = (str: string) => str.replace(/\s/g, '').replace(/\u200B/g, '');
      expect(normalize(discountCodeSummaryValue)).toContain(normalize(cleanDiscountCodeSummaryValueFormatted));
    } else {
      throw new Error('codeDiscountValue is null');
    }

    const totalSummaryValueFormattedParsed = parseFloat(totalSummaryValueFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueFormattedParsed:', totalSummaryValueFormattedParsed);

    const totalSummaryValueAfterDiscount = await cartPage.getTotalSummaryValue.last().textContent();
    console.log('totalSummaryValueAfterDiscount:', totalSummaryValueAfterDiscount);

    const totalSummaryValueAfterDiscountFormatted = totalSummaryValueAfterDiscount?.slice(10, -3) || ''
    console.log('totalSummaryValueAfterDiscountFormatted:', totalSummaryValueAfterDiscountFormatted);

    const totalSummaryValueAfterDiscountFormattedParsed = parseFloat(totalSummaryValueAfterDiscountFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueAfterDiscountFormattedParsed:', totalSummaryValueAfterDiscountFormattedParsed);

    const expectedPrice = totalSummaryValueFormattedParsed * 0.9;
    expect(Number(totalSummaryValueAfterDiscountFormattedParsed.toFixed(2))).toBe(Number(expectedPrice.toFixed(2)));

    await expect(cartPage.getSummaryDeleteDiscountCodeButton).toBeVisible();
    await cartPage.getSummaryDeleteDiscountCodeButton.click();
    await expect(cartPage.getSummaryDeleteDiscountCodeButton).not.toBeVisible({ timeout: 5000 });
    await expect(cartPage.getActiveDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });
    await expect(cartPage.getDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });

    const totalSummaryValueAfterDeleteCode = await cartPage.getTotalSummaryValue.last().textContent();
    console.log('totalSummaryValueAfterDeleteCode:', totalSummaryValueAfterDeleteCode);
    const totalSummaryValueAfterDeleteCodeFormatted = totalSummaryValueAfterDeleteCode?.slice(10, -3) || ''
    console.log('totalSummaryValueAfterDeleteCodeFormatted:', totalSummaryValueAfterDeleteCodeFormatted);
    const totalSummaryValueAfterDeleteCodeFormattedParsed = parseFloat(totalSummaryValueAfterDeleteCodeFormatted.replace(/\s/g, '').replace(',', '.'));
    console.log('totalSummaryValueAfterDeleteCodeFormattedParsed:', totalSummaryValueAfterDeleteCodeFormattedParsed);
    expect(totalSummaryValueAfterDeleteCodeFormattedParsed).toBe(totalSummaryValueFormattedParsed);
  })
})

