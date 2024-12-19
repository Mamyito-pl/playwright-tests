import { Page, expect } from '@playwright/test';
import ProductsPage from '../../page/Products.page.ts';
import MainPage from "../../page/Main.page.ts";
import CartPage from '../../page/Cart.page.ts';
import DeliveryPage from '../../page/Delivery.page.ts';
import PaymentsPage from '../../page/Payments.page.ts';
import CommonPage from '../../page/Common.page.ts';
import Przelewy24Page from '../../page/Przelewy24.page.ts';
import SearchbarPage from '../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';

test.describe('Testy płatności', async () => {
  
  test.describe.configure({ mode: 'serial'})

  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let paymentsPage: PaymentsPage;
  let przelewy24Page: Przelewy24Page;
  let commonPage: CommonPage;
  let productsPage: ProductsPage;
  let mainPage: MainPage;
  let searchbarPage : SearchbarPage;

  test.beforeEach(async ({ page, loginManual }) => {

    await allure.tags("Web", "Płatności")
    await allure.parentSuite("Webowe");
    await allure.suite("Płatności");

    await loginManual();

    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    deliveryPage = new DeliveryPage(page);
    paymentsPage = new PaymentsPage(page);
    przelewy24Page = new Przelewy24Page(page);
    commonPage = new CommonPage(page);
    productsPage = new ProductsPage(page);
    searchbarPage = new SearchbarPage(page);
  })
  
  test.afterEach(async ({ clearCart }) => {
    
    const shouldSkipClearCart = test.info().annotations.some(a => a.type === 'skipClearCart');

    if (!shouldSkipClearCart) {
      await clearCart();
  }
  }) 

  test.describe('Płatności BLIK', async () => {

    test.describe.configure({ mode: 'serial'});
  
    test.skip('W | Zapłata prawidłowym kodem BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      test.info().annotations.push({ type: 'skipClearCart' });

      test.setTimeout(130000);

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1500);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('777888');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 10000, state: 'hidden' });

      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 20000, state: 'hidden' });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    })

    test.skip('W | Zapłata nieprawidłowym kodem BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      test.info().annotations.push({ type: 'skipClearCart' });

      test.setTimeout(150000);

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123123');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 10000, state: 'hidden' });

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

    test('W | Zapłata pustym kodem BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Kod blik jest wymagany');
    })

    test('W | Zapłata za krótkim kodem BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
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
            
    test('W | Zapłata za długim kodem BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
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
                
    test('W | Zapłata kodem BLIK z nieprawidłowymi znakami', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      const symbols: string[] = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", "{", "[", "}", "]", "|", "\'", ":", ";", "'", '"', "<", ",", ">", ".", "/", "?"]

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
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
                    
    test.skip('W | Ponowna zapłata po nieudanej płatności BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')

      test.info().annotations.push({ type: 'skipClearCart' });

      test.setTimeout(170000);

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123456');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 10000, state: 'hidden' });

      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible(),
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

      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
                         
    test.skip('W | Zapłata przy odbiorze po nieudanej płatności BLIK', async ({ page, addProduct }) => {

      allure.subSuite('Płatność BLIK')
      
      test.info().annotations.push({ type: 'skipClearCart' });

      test.setTimeout(150000);

      await addProduct('kapsułki somat');

      for (let i = 0; i < 3; i++) {
          await searchbarPage.clickIncreaseProductButton();
          await page.waitForTimeout(1000);
      };

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.clickDeliverySlotButton();
      await cartPage.clickCartSummaryButton();
      await page.getByLabel('Kod BLIK').check();
      await paymentsPage.enterBlikCode('123123');
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 10000, state: 'hidden' });

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

      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
  })
})
