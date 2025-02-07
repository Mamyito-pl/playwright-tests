import { Page, expect } from '@playwright/test';
import ProductsPage from '../../page/Products.page.ts';
import MainPage from "../../page/Main.page.ts";
import CartPage from '../../page/Cart.page.ts';
import DeliveryPage from '../../page/Delivery.page.ts';
import PaymentsPage from '../../page/Payments.page.ts';
import Przelewy24Page from '../../page/Przelewy24.page.ts';
import OrderDetailsPage from '../../page/OrderDetails.page.ts';
import CommonPage from '../../page/Common.page.ts';
import SearchbarPage from '../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';

test.describe.configure({ mode: 'serial'})

test.describe('Testy płatności', async () => {

  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let paymentsPage: PaymentsPage;
  let przelewy24Page: Przelewy24Page;
  let orderDetailsPage: OrderDetailsPage;
  let commonPage: CommonPage;
  let productsPage: ProductsPage;
  let mainPage: MainPage;
  let searchbarPage : SearchbarPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await loginManual();

    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    deliveryPage = new DeliveryPage(page);
    paymentsPage = new PaymentsPage(page);
    przelewy24Page = new Przelewy24Page(page);
    orderDetailsPage = new OrderDetailsPage(page);
    commonPage = new CommonPage(page)
    productsPage = new ProductsPage(page);
    searchbarPage = new SearchbarPage(page);
  })
  
  test.afterEach(async ({ clearCart }) => {
    
    const shouldSkipClearCart = test.info().annotations.some(a => a.type === 'skipClearCart');

    if (!shouldSkipClearCart) {
      await clearCart();
    }
  })

  test('M | Przejście do sklepu podczas przetwarzania płatności', async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('480');

    if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
      test.info().annotations.push({ type: 'skipClearCart' });
    }

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct('tabletki do mycia naczyń somat');

    for (let i = 0; i < 3; i++) {
        await searchbarPage.clickIncreaseProductButton();
        await page.waitForTimeout(1000);
    };

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.getByLabel('Płatność kartą przy odbiorze').check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButtonButton();
    await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickBackHomeButton();

    await expect(page).toHaveURL(`${baseURL}`);
    await expect(mainPage.getBannersSection).toBeVisible();

    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeHidden({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeHidden({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeHidden();
    await expect(paymentsPage.getOrderDetailsButton).toBeHidden();
    await expect(paymentsPage.getRepeatOrderButton).toBeHidden();
    await expect(paymentsPage.getBackHomeButton).toBeHidden();
  })

  test('M | Okno ponownego zamówienia otwiera się ze wszystkimi potrzebnymi polami', async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('481');

    if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
      test.info().annotations.push({ type: 'skipClearCart' });
    }

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct('tabletki do mycia naczyń somat');

    for (let i = 0; i < 3; i++) {
        await searchbarPage.clickIncreaseProductButton();
        await page.waitForTimeout(1000);
    };

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.getByLabel('Płatność kartą przy odbiorze').check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButtonButton();
    await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await paymentsPage.clickRepeatOrderButton();

    await expect(page.getByText('Ponów zamówienie')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Ponowienie zamówienia spowoduje dodanie poniższych produktów do Twojego koszyka.')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Chemia i środki czystości')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('1 produkt')).toBeVisible({ timeout: 5000 });
    await expect(paymentsPage.getCloseIconButtonRepeatOrderWindow).toBeVisible({ timeout: 5000 });
    await expect(paymentsPage.getAddProductsButtonRepeatOrderWindow).toBeVisible({ timeout: 5000 });
    await expect(paymentsPage.getCancelButtonRepeatOrderWindow).toBeVisible({ timeout: 5000 });
  })
  
  test('M | Przejście do szczegółów zamówienia podczas przetwarzania płatności', async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('482');

    if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
      test.info().annotations.push({ type: 'skipClearCart' });
    }

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct('tabletki do mycia naczyń somat');

    for (let i = 0; i < 3; i++) {
        await searchbarPage.clickIncreaseProductButton();
        await page.waitForTimeout(1000);
    };

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.getByLabel('Płatność kartą przy odbiorze').check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButtonButton();
    await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/'));
    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible({ timeout: 5000 });
  })

  test('M | Możliwość zapłaty za zamówienie z poziomu listy zamówień', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('483');

    if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
      test.info().annotations.push({ type: 'skipClearCart' });
    }

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(180000);

    await addProduct('tabletki do mycia naczyń somat');

    for (let i = 0; i < 3; i++) {
        await searchbarPage.clickIncreaseProductButton();
        await page.waitForTimeout(1000);
    };

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
    await cartPage.clickCartSummaryButton();
    await page.getByLabel('Przelew online').check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButtonButton();
    await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 7000, state: 'hidden' });

    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
    await przelewy24Page.clickErrorPayButton();
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
    await przelewy24Page.clickBackToShopButton();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp('^https://mamyito-front.test.desmart.live/profil/'));
    await expect(orderDetailsPage.getPayButton).toBeVisible();
    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible();
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible();
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible();

    await orderDetailsPage.clickPayButton();

    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
    await przelewy24Page.clickPayButton();
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();
  })
  
  test.describe('Płatność BLIK', async () => {
    
    test('M | Zapłata prawidłowym kodem BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('484');
  
      if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
        test.info().annotations.push({ type: 'skipClearCart' });
      }

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
    
      test.setTimeout(130000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('777888');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
    
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    })

    test('M | Zapłata nieprawidłowym kodem BLIK', async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('485');
  
      if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
        test.info().annotations.push({ type: 'skipClearCart' });
      }

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(150000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123123');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
    })
  
    test('M | Zapłata pustym kodem BLIK', async ({ page, addProduct }) => {
    
      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('484');

      test.setTimeout(80000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Kod blik jest wymagany');
    })
    
    test('M | Zapłata za krótkim kodem BLIK', async ({ page, addProduct }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('48');

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123');
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
    })
        
    test('M | Zapłata za długim kodem BLIK', async ({ page, addProduct }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('488');
  
      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('12345678');
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
    })
                    
    test('M | Zapłata kodem BLIK z nieprawidłowymi znakami', async ({ page, addProduct }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('489');

      test.setTimeout(130000);

      const symbols: string[] = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", "{", "[", "}", "]", "|", "\'", ":", ";", "'", '"', "<", ",", ">", ".", "/", "?"];

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('12345');

      for (const symbol of symbols) {
        await page.keyboard.press(symbol);
        await page.waitForTimeout(1000);
        await paymentsPage.checkStatue();
        expect(paymentsPage.getStatueCheckbox.isChecked()).toBeTruthy();
        expect(cartPage.getCartPaymentButton.isDisabled()).toBeTruthy();
        await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
        await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
        await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
        await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
        await page.locator(selectors.PaymentsPage.common.blikPaymentInput).click();
        await page.keyboard.press('Backspace');
      }
    })
                        
    test('M | Ponowna zapłata po nieudanej płatności BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('490');
  
      if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
        test.info().annotations.push({ type: 'skipClearCart' });
      }

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(180000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123456');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });

      await paymentsPage.clickRepeatPaymentButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainBlikButton();
      await przelewy24Page.clickChosenBlikButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
                            
    test('M | Zapłata przy odbiorze po nieudanej płatności BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('491');
  
      if (!test.info().status || test.info().status == 'passed', 'timedOut', 'interrupted', 'skipped') {
        test.info().annotations.push({ type: 'skipClearCart' });
      }

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(150000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123123');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });

      await paymentsPage.clickPaymentOnDeliveryButton();

      await expect(commonPage.getMessage).toBeVisible({ timeout: 3000 });
      await expect(commonPage.getMessage).toHaveText('Metoda płatności została zmieniona', { timeout: 3000 });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeHidden({ timeout: 5000 });


      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
  })

  test.describe('Płatności przelewem online', async () => {
  
    test('M | Zapłata przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('492');

      test.info().annotations.push({ type: 'skipClearCart' });

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(130000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1500);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Przelew online').check();
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    }) 
    
    test('M | Błędna płatność przelewem online', async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('493');

      test.info().annotations.push({ type: 'skipClearCart' });

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(200000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1500);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Przelew online').check();
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickErrorPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    }) 
                            
    test('M | Ponowna zapłata po nieudanej płatności przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('494');

      test.info().annotations.push({ type: 'skipClearCart' });

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(170000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Przelew online').check();
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickErrorPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
      
      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      
      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await paymentsPage.clickRepeatPaymentButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
                                
    test('M | Zapłata przy odbiorze po nieudanej płatności przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('495');

      test.info().annotations.push({ type: 'skipClearCart' });

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(170000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Przelew online').check();
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickErrorPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 80000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.clickPaymentOnDeliveryButton();

      await expect(commonPage.getMessage).toBeVisible({ timeout: 3000 });
      await expect(commonPage.getMessage).toHaveText('Metoda płatności została zmieniona', { timeout: 3000 });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeHidden({ timeout: 5000 });

      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
  })
  
  test.describe('Zapłata kartą przy odbiorze', async () => {
  
    test('M | Zapłata kartą przy odbiorze', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Zapłata kartą przy odbiorze');
      await allure.allureId('688');

      test.info().annotations.push({ type: 'skipClearCart' });

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(130000);

      await addProduct('tabletki do mycia naczyń somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1500);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.getCartSummaryButton.scrollIntoViewIfNeeded();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Płatność kartą przy odbiorze').check();
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
  })
})
