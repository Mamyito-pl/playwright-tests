/*import { expect } from '@playwright/test';
import MainPage from "../../../page/Main.page.ts";
import CartPage from '../../../page/Cart.page.ts';
import DeliveryPage from '../../../page/Delivery.page.ts';
import PaymentsPage from '../../../page/Payments.page.ts';
import OrderDetailsPage from '../../../page/Profile/OrderDetails.page.ts';
import CommonPage from '../../../page/Common.page.ts';
import SearchbarPage from '../../../page/Searchbar.page.ts';
import OrdersPage from '../../../page/Profile/OrdersList.page.ts';
import OrderEditPage from '../../../page/Profile/OrderEdit.page.ts';
import ProductsListPage from '../../../page/ProductsList.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../../utils/selectors.json';
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';
import Przelewy24Page from '../../../page/Przelewy24.page.ts';

test.describe.configure({ mode: 'serial' })

test.describe('Testy edycji zamówienia', async () => {

  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let paymentsPage: PaymentsPage;
  let orderDetailsPage: OrderDetailsPage;
  let ordersPage: OrdersPage;
  let orderEditPage: OrderEditPage;
  let productsListPage: ProductsListPage;
  let commonPage: CommonPage;
  let mainPage: MainPage;
  let searchbarPage : SearchbarPage;
  let przelewy24Page: Przelewy24Page;
  let product = 'janex polędwica wołowa';
  let paymentMethodCard = 'Płatność kartą przy odbiorze';
  let paymentMethodBlik = 'Kod BLIK';
  let paymentMethodPrzelewy24 = 'Przelew online';
  let paymentMethodBlikCode = '777666';

  test.beforeEach(async ({ page, addAddressDeliveryViaAPI }) => {

    await addAddressDeliveryViaAPI('Adres Testowy');

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    deliveryPage = new DeliveryPage(page);
    paymentsPage = new PaymentsPage(page);
    orderDetailsPage = new OrderDetailsPage(page);
    ordersPage = new OrdersPage(page);
    orderEditPage = new OrderEditPage(page);
    productsListPage = new ProductsListPage(page);
    commonPage = new CommonPage(page);
    searchbarPage = new SearchbarPage(page);
    przelewy24Page = new Przelewy24Page(page);
  })
  
  test.afterEach(async ({ deleteDeliveryAddressViaAPI, clearCartViaAPI }) => {
    await deleteDeliveryAddressViaAPI('Adres Testowy');
    await deleteDeliveryAddressViaAPI('Adres Drugi');
    await clearCartViaAPI();
  }) 

  test('W | Wyjście z edycji z poziomu koszyka', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2464');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await expect(orderEditPage.getCancelEditOrderCartButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickCancelEditOrderCartButton();
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalCancelButton).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalLeaveButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickConfirmationEditOrderCancelCartModalLeaveButton();
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalTitle).not.toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getCancelEditOrderCartButton).not.toBeVisible({ timeout: 10000 });
  })
    
  test('W | Zamknięcie modala rozpoczęcia edycji "X" z poziomu zamówienia', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2465');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await commonPage.getModalCloseIcon.click({ force: true, delay: 300 });
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).not.toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsCount).not.toBeVisible({ timeout: 10000 });
  })

  test('W | Modal zatwierdzenia edycji z poziomu koszyka zamyka się po kliknięciu "X"', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct, cancelEditOrderViaAPI }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2466');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const url = new URL(page.url());
    const saleOrderId = url.searchParams.get('order');

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderCartButton();
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalCancelButton).toBeVisible({ timeout: 10000 });
    await commonPage.getModalCloseIcon.click({ force: true, delay: 300 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalCancelButton).not.toBeVisible({ timeout: 10000 });

    await page.goto(`/profil/zamowienia/?order=${saleOrderId}`, { waitUntil: 'load'});
    await cancelEditOrderViaAPI(page);
  })
  
  test('W | Modal zatwierdzenia edycji z poziomu koszyka zamyka się po kliknięciu w przycisk anuluj', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct, cancelEditOrderViaAPI }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2467');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const url = new URL(page.url());
    const saleOrderId = url.searchParams.get('order');

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderCartButton();
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalCancelButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickConfirmationEditOrderCartModalCancelButton();
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 10000 });

    await page.goto(`/profil/zamowienia/?order=${saleOrderId}`, { waitUntil: 'load'});
    await cancelEditOrderViaAPI(page);
  })

  test('W | Modal "Anuluj edycję" z poziomu koszyka zamyka się po kliknięciu w przycisk anuluj', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct, cancelEditOrderViaAPI }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2468');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const url = new URL(page.url());
    const saleOrderId = url.searchParams.get('order');

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await expect(orderEditPage.getCancelEditOrderCartButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickCancelEditOrderCartButton();
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalCancelButton).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalLeaveButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickConfirmationEditOrderCancelCartModalCancelButton();
    await expect(orderEditPage.getConfirmationEditOrderCancelCartModalTitle).not.toBeVisible({ timeout: 10000 });

    await page.goto(`/profil/zamowienia/?order=${saleOrderId}`, { waitUntil: 'load'});
    await cancelEditOrderViaAPI(page);
  })

  test('W | Modal rozpoczęcia edycji z poziomu zamówienia zamyka się po kliknięciu w przycisk anuluj', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2469');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getCancelEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickCancelEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  })

  test('W | Zmiana adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct, addSecondAddressDeliveryViaAPI }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2470');

    await addSecondAddressDeliveryViaAPI('Adres Drugi');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodBlik).check();
    await paymentsPage.enterBlikCode(paymentMethodBlikCode);
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    
    await page.getByText('Adres Drugi').click();

    await page.waitForTimeout(3000);

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    const adresTitleBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualny adres').locator('..').getByText('Adres Testowy').isVisible();
    const adressStreetBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualny adres').locator('..').getByText('aleja Jana Pawła II').isVisible();
    const adressHouseNumberBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualny adres').locator('..').getByText('1').isVisible();
    const adressPostalCodeBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualny adres').locator('..').getByText('00-828').isVisible();
    expect(adresTitleBeforeEditIsVisible).toBe(true);
    expect(adressStreetBeforeEditIsVisible).toBe(true);
    expect(adressHouseNumberBeforeEditIsVisible).toBe(true);
    expect(adressPostalCodeBeforeEditIsVisible).toBe(true);

    const adresTitleAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('Adres Drugi').isVisible();
    const adressStreetAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('Oficerska').isVisible();
    const adressHouseNumberAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('4').isVisible();
    const adressPostalCodeAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('05-506').isVisible();
    expect(adresTitleAfterEditIsVisible).toBe(true);
    expect(adressStreetAfterEditIsVisible).toBe(true);
    expect(adressHouseNumberAfterEditIsVisible).toBe(true);
    expect(adressPostalCodeAfterEditIsVisible).toBe(true);

    const button = page.getByRole('button', { name: `Do zwrotu 0 zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await button.click({ force: true });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Nazwisko i imię').locator('..').locator('div').last()).toContainText('Kowalska Janina');

    await expect(page.getByText('Numer telefonu').locator('..').locator('div').last()).toContainText('666555444');

    await expect(page.getByText('Adres', { exact: true }).locator('..').locator('div').last()).toContainText('Oficerska 405-506 Lesznowola');
  })

  test('W | Zmiana terminu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2471');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await page.waitForTimeout(1000);

    let deliverySlotHours = '';
    const deliverySlotHoursLocator = page.locator('div[class*="sc-b70c308c-8 dtyaIF"]');
    if (await deliverySlotHoursLocator.evaluate((el) => window.getComputedStyle(el).color === 'rgb(38, 38, 38)')) {
      deliverySlotHours = (await deliverySlotHoursLocator.textContent() || '').replace(/-/g, ' - ');
        console.log(deliverySlotHours);
    } else {
        console.log('Nie znaleziono elementu');
    }

    let deliverySlotDate = '';
    const deliverySlotDateLocator = page.locator('div[class*="sc-b70c308c-4 hzmgpl"]');
    if (await deliverySlotDateLocator.evaluate((el) => window.getComputedStyle(el).color === 'rgb(38, 38, 38)')) {
      deliverySlotDate = await deliverySlotDateLocator.textContent() || '';
        console.log(deliverySlotDate);
    } else {
        console.log('Nie znaleziono elementu');
    }

    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodBlik).check();
    await paymentsPage.enterBlikCode(paymentMethodBlikCode);
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    
    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.last().click();
    await page.waitForTimeout(3000);

    let deliverySlotHoursAfterEdit = '';
    const deliverySlotHoursLocatorAfterEdit = page.locator('div[class*="sc-b70c308c-8 dtyaIF"]');
    if (await deliverySlotHoursLocatorAfterEdit.evaluate((el) => window.getComputedStyle(el).color === 'rgb(38, 38, 38)')) {
        deliverySlotHoursAfterEdit = (await deliverySlotHoursLocatorAfterEdit.textContent() || '').replace(/-/g, ' - ');
      console.log(deliverySlotHoursAfterEdit);
    } else {
      console.log('Nie znaleziono elementu');
    }

    let deliverySlotDateAfterEdit = '';
    const deliverySlotDateLocatorAfterEdit = page.locator('div[class*="sc-b70c308c-4 hzmgpl"]');
    if (await deliverySlotDateLocatorAfterEdit.evaluate((el) => window.getComputedStyle(el).color === 'rgb(38, 38, 38)')) {
      deliverySlotDateAfterEdit = await deliverySlotDateLocatorAfterEdit.textContent() || '';
        console.log(deliverySlotDateAfterEdit);
    } else {
        console.log('Nie znaleziono elementu');
    }
    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    console.log(deliverySlotHours);
    console.log(deliverySlotHoursAfterEdit);
    const deliverySlotHoursBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualny termin').locator('..').getByText(deliverySlotHours).isVisible();
    expect(deliverySlotHoursBeforeEditIsVisible).toBe(true);
    const deliverySlotHoursAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText(deliverySlotHoursAfterEdit).isVisible();
    expect(deliverySlotHoursAfterEditIsVisible).toBe(true);
    const button = page.getByRole('button', { name: `Do zwrotu 0 zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await button.click({ force: true });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    const deliverySlotDateAfterEditFormatted = deliverySlotDateAfterEdit.replace(/^[^\d]+/, '');
    console.log(deliverySlotDateAfterEditFormatted);

    const deliverySlotHoursAfterEditWithoutSpaces = deliverySlotHoursAfterEdit.replace(/---/g, ' - ');
    console.log(deliverySlotHoursAfterEditWithoutSpaces);

    await expect(page.getByText('Godzina dostawy').locator('..').locator('div').last()).toContainText(deliverySlotHoursAfterEditWithoutSpaces);
    await expect(page.getByText('Termin dostawy').locator('..').locator('div').last()).toContainText(deliverySlotDateAfterEditFormatted);
  })

  test('W | Dodanie kodu rabatowego kwotowego', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2472');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    await page.getByText('-10zł').locator('..').locator('button').click();

    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });

    const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));

    console.log(summaryPriceAfterChanges);

    const expectedPrice = summaryPrice -10;
    expect(Number(summaryPriceAfterChanges.toFixed(2))).toBe(Number(expectedPrice.toFixed(2)));

    const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
    console.log('Różnica w cenie:', priceDifference);
    const priceDifferenceAfterEdit = Math.abs((summaryPrice - parseFloat(priceDifference))).toFixed(2).replace(/\.?0+$/, '');

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    const discountCodeBeforeEditIsNotVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualne kody rabatowe:').locator('..').getByText('Brak').isVisible();
    expect(discountCodeBeforeEditIsNotVisible).toBe(true);
    const discountCodeAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('Zmieniasz na:KK10').isVisible();
    expect(discountCodeAfterEditIsVisible).toBe(true);
    const button = page.getByRole('button', { name: `Do zapłaty ${priceDifferenceAfterEdit} zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await button.click({ force: true });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
    expect(finalPrice).toBe(summaryPriceAfterChanges);
  })

  test('W | Dodanie kodu rabatowego procentowego', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2473');
      
    test.setTimeout(150000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodCard).check();
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    await page.getByText('-10%').locator('..').locator('button').click();

    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });

    const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));

    console.log(summaryPriceAfterChanges);

    const expectedPrice = summaryPrice * 0.9;
    expect(Number(summaryPriceAfterChanges.toFixed(2))).toBe(Number(expectedPrice.toFixed(2)));

    const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
    console.log('Różnica w cenie:', priceDifference);
    const priceDifferenceAfterEdit = Math.abs((summaryPrice - parseFloat(priceDifference))).toFixed(2).replace(/\.?0+$/, '');

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    const discountCodeBeforeEditIsNotVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualne kody rabatowe:').locator('..').getByText('Brak').isVisible();
    expect(discountCodeBeforeEditIsNotVisible).toBe(true);
    const discountCodeAfterEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('Zmieniasz na:KP10').isVisible();
    expect(discountCodeAfterEditIsVisible).toBe(true);
    const button = page.getByRole('button', { name: `Do zapłaty ${priceDifferenceAfterEdit} zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await button.click({ force: true });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
    expect(finalPrice).toBe(summaryPriceAfterChanges);
  })

  test('W | Usunięcie kodu rabatowego', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('');
    await allure.allureId('2474');
      
    test.setTimeout(200000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000)

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.getCartAvailableCodesButton.click();

    await expect(cartPage.getCartCodesDrawer).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    await page.getByText('-10zł').locator('..').locator('button').click();

    await expect(cartPage.getCartCodesDrawer).not.toBeVisible({ timeout: 5000 });

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodBlik).check();
    await paymentsPage.enterBlikCode(paymentMethodBlikCode);
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    await expect(cartPage.getSummaryDeleteDiscountCodeButton).toBeVisible();
    await cartPage.getSummaryDeleteDiscountCodeButton.click();
    await expect(cartPage.getSummaryDeleteDiscountCodeButton).not.toBeVisible({ timeout: 5000 });
    await expect(cartPage.getActiveDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });
    await expect(cartPage.getDiscountCodesTitle).not.toBeVisible({ timeout: 5000 });

    const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));

    console.log(summaryPriceAfterChanges);

    const expectedPrice = summaryPrice +10;
    expect(Number(summaryPriceAfterChanges.toFixed(2))).toBe(Number(expectedPrice.toFixed(2)));

    const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
    console.log('Różnica w cenie:', priceDifference);

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    const discountCodeBeforeEditIsVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Aktualne kody rabatowe:').locator('..').getByText('KK10').isVisible();
    expect(discountCodeBeforeEditIsVisible).toBe(true);
    const discountCodeAfterEditIsNotVisible = await orderEditPage.getConfirmationEditOrderModal.getByText('Zmieniasz na:').locator('..').getByText('Brak').isVisible();
    expect(discountCodeAfterEditIsNotVisible).toBe(true);
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await button.click({ force: true });

    await expect(orderEditPage.getEnterBlikCodeModalTitle).toBeVisible({ timeout: 15000 });
    await expect(orderEditPage.getEnterBlikCodeModalInput).toBeVisible({ timeout: 5000 });
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeVisible({ timeout: 5000 });
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeDisabled();
    await orderEditPage.getEnterBlikCodeModalInput.fill(paymentMethodBlikCode);
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).not.toBeDisabled({ timeout: 5000 });
    await orderEditPage.getEnterBlikCodeModalPayButton.click();
    await expect(orderEditPage.getEnterBlikCodeModalTitle).not.toBeVisible({ timeout: 15000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
    expect(finalPrice).toBe(summaryPriceAfterChanges);
  })

  test.describe('Edycja zamówienia z dopłatą', async () => {

    test('W | Dopłata do zamówienia z pełną manipulacją produktów w koszyku', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Edycja zamówienia');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy edycji zamówienia');
    await allure.subSuite('Edycja zamówienia z dopłatą');
    await allure.allureId('2475');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(150000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct(product);
    await page.waitForTimeout(2000);
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
    await expect(searchbarPage.getSearchbarProductNames.first()).toBeVisible({ timeout: 15000 });

    for (let i = 0; i < 3; i++) {
      await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
      await page.waitForTimeout(4000);
    }

    await searchbarPage.getProductItemCount.first().click();
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().click();
    await cartPage.clickCartSummaryPaymentButton();
    await page.getByLabel(paymentMethodBlik).check();
    await paymentsPage.enterBlikCode(paymentMethodBlikCode);
    await paymentsPage.checkStatue();
    const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
    .replace(/[^0-9,.]/g, '')
    .replace(',', '.'));
    console.log(summaryPrice);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });

    const productNames = await orderDetailsPage.getProductNames.all();
    const productQuantities = await orderDetailsPage.getProductQuantity.all();

    const initialProducts: { name: string | undefined; quantity: number; }[] = [];

    for (let i = 0; i < productNames.length; i++) {
    const name = await productNames[i].textContent();
    const quantity = await productQuantities[i].textContent();
    
    initialProducts.push({
        name: name?.trim(),
        quantity: parseFloat(quantity?.trim() || '0'),
      });
      await page.waitForTimeout(1000);
    }

    console.log(initialProducts);
    
    await orderDetailsPage.clickEditOrderButton();
    await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
    await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
    await orderEditPage.clickApplyEditOrderModalButton();
    await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
  
    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    const productNamesCart = await cartPage.getProductNames.all();
    const productQuantitiesCart = await cartPage.getProductQuantities.all();

    const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];

    for (let i = 0; i < productNamesCart.length; i++) {
      const name = await productNamesCart[i].textContent();
      const quantity = await productQuantitiesCart[i].inputValue();
      
      initialProductsCart.push({
        name: name?.trim(),
        quantity: parseFloat(quantity?.trim() || '0'),
      });
    }

    console.log(initialProductsCart);

    expect(initialProducts).toEqual(initialProductsCart);

    await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
    await page.waitForTimeout(5000);

    const inputToIncrease = await page.locator('div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
    for (let i = 0; i < inputToIncrease.length; i++) {
        const value = await inputToIncrease[i].inputValue();
        if (value === '1') {
            await inputToIncrease[i].click();
            await inputToIncrease[i].fill('10');
            await page.waitForTimeout(5000);
            break;
        }
    }

    const inputToDelete = await page.locator('div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
    for (let i = 0; i < inputToDelete.length; i++) {
        const value = await inputToDelete[i].inputValue();
        if (value === '1') {
            await page.locator(selectors.CartPage.common.deleteProductCartIcon).nth(i).click();
            await expect(cartPage.getProductCartConfirmButton).toBeVisible({ timeout: 15000 });
            await cartPage.clickDeleteProductCartConfirmButton();
            await page.waitForTimeout(1000);
            break;
        }
    }

    await page.goto('/wyprzedaz', { waitUntil: 'load'});
    await expect(productsListPage.getProductCategoryTitle('Wyprzedaż')).toBeVisible({ timeout: 15000 });

    await productsListPage.getProductTiles.first().getByText('Dodaj').scrollIntoViewIfNeeded();
    await productsListPage.getProductTiles.first().getByText('Dodaj').click({ force: true });
    await page.waitForTimeout(3000);
    
    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    const productNamesCartAfterChanges = await cartPage.getProductNames.all();
    const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();

    const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];

    for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
      const name = await productNamesCartAfterChanges[i].textContent();
      const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
      
      initialProductsCartAfterChanges.push({
        name: name?.trim(),
        quantity: parseFloat(quantity?.trim() || '0'),
      });
    }

    console.log(initialProductsCartAfterChanges);

    const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));

    console.log(summaryPriceAfterChanges);

    const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
    console.log('Różnica w cenie:', priceDifference);

    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
    const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
    await expect(button).toBeVisible({ timeout: 5000 });
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await button.click({ force: true });

    await expect(orderEditPage.getEnterBlikCodeModalTitle).toBeVisible({ timeout: 15000 });
    await expect(orderEditPage.getEnterBlikCodeModalInput).toBeVisible({ timeout: 5000 });
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeVisible({ timeout: 5000 });
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeDisabled();
    await orderEditPage.getEnterBlikCodeModalInput.fill(paymentMethodBlikCode);
    await expect(orderEditPage.getEnterBlikCodeModalPayButton).not.toBeDisabled({ timeout: 5000 });
    await orderEditPage.getEnterBlikCodeModalPayButton.click();
    await expect(orderEditPage.getEnterBlikCodeModalTitle).not.toBeVisible({ timeout: 15000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
    await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    
    await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });

    const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
    const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();

    const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];

    for (let i = 0; i < productNamesAfterEdit.length; i++) {
    const name = await productNamesAfterEdit[i].textContent();
    const quantity = await productQuantitiesAfterEdit[i].textContent();
    
    initialProductsAfterEdit.push({
        name: name?.trim(),
        quantity: parseFloat(quantity?.trim() || '0'),
      });
      await page.waitForTimeout(1000);
    }

    console.log(initialProductsAfterEdit);

    expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);

    expect(productNamesAfterEdit.length).toBe(3);

    const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
    expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z BLIK na przelew', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2476');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodBlik).check();
      await paymentsPage.enterBlikCode(paymentMethodBlikCode);
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel('Przelew online').check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);
  
      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
  
      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Przelewy24');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z BLIK na kartę przy odbiorze', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2477');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodBlik).check();
      await paymentsPage.enterBlikCode(paymentMethodBlikCode);
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodCard).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Płatność kartą przy odbiorze');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z przelewu na BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2478');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodPrzelewy24).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodBlik).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(orderEditPage.getEnterBlikCodeModalTitle).toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getEnterBlikCodeModalInput).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeDisabled();
      await orderEditPage.getEnterBlikCodeModalInput.fill(paymentMethodBlikCode);
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).not.toBeDisabled({ timeout: 5000 });
      await orderEditPage.getEnterBlikCodeModalPayButton.click();
      await expect(orderEditPage.getEnterBlikCodeModalTitle).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Blik');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z przelewu na kartę przy odbiorze', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2479');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodPrzelewy24).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodCard).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Płatność kartą przy odbiorze');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z karty przy odbiorze na BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2480');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodCard).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodBlik).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });

      await expect(orderEditPage.getEnterBlikCodeModalTitle).toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getEnterBlikCodeModalInput).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeDisabled();
      await orderEditPage.getEnterBlikCodeModalInput.fill(paymentMethodBlikCode);
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).not.toBeDisabled({ timeout: 5000 });
      await orderEditPage.getEnterBlikCodeModalPayButton.click();
      await expect(orderEditPage.getEnterBlikCodeModalTitle).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Blik');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Dopłata do zamówienia z karty przy odbiorze na przelew', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia z dopłatą');
      await allure.allureId('2481'); 

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodCard).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodPrzelewy24).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Przelewy24');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })
  })

  test.describe('Edycja zamówienia ze zwrotem środków', async () => {

    test('W | Zwrot środków zamówienia z pełną manipulacją produktów w koszyku', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL }) => {

        await allure.tags('Web', 'Edycja zamówienia');
        await allure.epic('Webowe');
        await allure.parentSuite('Profil');
        await allure.suite('Testy edycji zamówienia');
        await allure.subSuite('Edycja zamówienia ze zwrotem środków');
        await allure.allureId('2482');

        test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
        test.setTimeout(150000);
    
        await searchbarPage.getSearchbarInput.click();
        await page.waitForTimeout(1000);
        await searchbarPage.enterProduct(product);
        await page.waitForTimeout(2000);
        await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
        await expect(searchbarPage.getSearchbarProductNames.first()).toBeVisible({ timeout: 15000 });
    
        for (let i = 0; i < 3; i++) {
          await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
          await page.waitForTimeout(4000);
        }
    
        await searchbarPage.getProductItemCount.first().click();
        await page.waitForTimeout(1000);
        await searchbarPage.getProductItemCount.first().type('1');
        await commonPage.getCartButton.click();
        await page.waitForTimeout(1000);
    
        await page.goto('/koszyk', { waitUntil: 'load'});
        await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
        await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
    
        await cartPage.clickCartSummaryButton();
        await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
        await deliveryPage.getDeliverySlotButton.first().click();
        await cartPage.clickCartSummaryPaymentButton();
        await page.getByLabel(paymentMethodBlik).check();
        await paymentsPage.enterBlikCode(paymentMethodBlikCode);
        await paymentsPage.checkStatue();
        const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
        console.log(summaryPrice);
        await cartPage.clickCartPaymentConfirmationButton();
        await cartPage.waitForPaymentConfirmationButton();

        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
        await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
        await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
        await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
        await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
        await paymentsPage.clickOrderDetailsButton();

        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
    
        await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
        const productNames = await orderDetailsPage.getProductNames.all();
        const productQuantities = await orderDetailsPage.getProductQuantity.all();
    
        const initialProducts: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNames.length; i++) {
        const name = await productNames[i].textContent();
        const quantity = await productQuantities[i].textContent();
        
        initialProducts.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
          await page.waitForTimeout(1000);
        }
    
        console.log(initialProducts);
        
        await orderDetailsPage.clickEditOrderButton();
        await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
        await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
        await orderEditPage.clickApplyEditOrderModalButton();
        await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
      
        await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
        await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
    
        await page.goto('/koszyk', { waitUntil: 'load'});
        await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    
        const productNamesCart = await cartPage.getProductNames.all();
        const productQuantitiesCart = await cartPage.getProductQuantities.all();
    
        const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNamesCart.length; i++) {
          const name = await productNamesCart[i].textContent();
          const quantity = await productQuantitiesCart[i].inputValue();
          
          initialProductsCart.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
        }
    
        console.log(initialProductsCart);
    
        expect(initialProducts).toEqual(initialProductsCart);
    
        await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
        await page.waitForTimeout(5000);
    
        const inputToIncrease = await page.locator('div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
        for (let i = 0; i < inputToIncrease.length; i++) {
            const value = await inputToIncrease[i].inputValue();
            if (value === '1') {
                await inputToIncrease[i].click();
                await inputToIncrease[i].fill('2');
                await page.waitForTimeout(5000);
                break;
            }
        }
    
        const inputToDelete = await page.locator('div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
        for (let i = 0; i < inputToDelete.length; i++) {
            const value = await inputToDelete[i].inputValue();
            if (value === '1') {
                await page.locator(selectors.CartPage.common.deleteProductCartIcon).nth(i).click();
                await expect(cartPage.getProductCartConfirmButton).toBeVisible({ timeout: 15000 });
                await cartPage.clickDeleteProductCartConfirmButton();
                await page.waitForTimeout(1000);
                break;
            }
        }
    
        await page.goto('/wyprzedaz', { waitUntil: 'load'});
        await expect(productsListPage.getProductCategoryTitle('Wyprzedaż')).toBeVisible({ timeout: 15000 });
    
        await productsListPage.getProductTiles.first().getByText('Dodaj').scrollIntoViewIfNeeded();
        await productsListPage.getProductTiles.first().getByText('Dodaj').click({ force: true });
        await page.waitForTimeout(3000);
        
        await page.goto('/koszyk', { waitUntil: 'load'});
        await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    
        const productNamesCartAfterChanges = await cartPage.getProductNames.all();
        const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
    
        const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
          const name = await productNamesCartAfterChanges[i].textContent();
          const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
          
          initialProductsCartAfterChanges.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
        }
    
        console.log(initialProductsCartAfterChanges);
    
        const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
            .replace(/[^0-9,.]/g, '')
            .replace(',', '.'));
    
        console.log(summaryPriceAfterChanges);

        const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
        console.log('Różnica w cenie:', priceDifference);

        await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
        await orderEditPage.clickApplyEditOrderCartButton();
    
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
        const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`});
        await expect(button).toBeVisible({ timeout: 5000 });
        await page.mouse.move(960, 540);
        await page.mouse.wheel(0, 1500);
        await page.waitForTimeout(700);
        await button.click({ force: true });
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });
    
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
        await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 20000 });
        await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
        await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
        await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
        await expect(paymentsPage.getBackHomeButton).toBeVisible();
    
        await paymentsPage.clickOrderDetailsButton();
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
    
        await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
        await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
        
        await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
    
        const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
        const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
    
        const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNamesAfterEdit.length; i++) {
        const name = await productNamesAfterEdit[i].textContent();
        const quantity = await productQuantitiesAfterEdit[i].textContent();
        
        initialProductsAfterEdit.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
          await page.waitForTimeout(1000);
        }
    
        console.log(initialProductsAfterEdit);
    
        expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);

        expect(productNamesAfterEdit.length).toBe(3);

        const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
        expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Zwrot środków z BLIK na przelew', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

        await allure.tags('Web', 'Edycja zamówienia');
        await allure.epic('Webowe');
        await allure.parentSuite('Profil');
        await allure.suite('Testy edycji zamówienia');
        await allure.subSuite('Edycja zamówienia ze zwrotem środków');
        await allure.allureId('2483');

        test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
        test.setTimeout(150000);
    
        await addProduct(product);
    
        await searchbarPage.getProductItemCount.first().click();
        await page.waitForTimeout(1000);
        await searchbarPage.getProductItemCount.first().type('1');
        await commonPage.getCartButton.click();
        await page.waitForTimeout(1000);
    
        await page.goto('/koszyk', { waitUntil: 'load'});
        await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
        await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
    
        await cartPage.clickCartSummaryButton();
        await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
        await deliveryPage.getDeliverySlotButton.first().click();
        await cartPage.clickCartSummaryPaymentButton();
        await page.getByLabel(paymentMethodBlik).check();
        await paymentsPage.enterBlikCode(paymentMethodBlikCode);
        await paymentsPage.checkStatue();
        const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
        console.log(summaryPrice);
        await cartPage.clickCartPaymentConfirmationButton();
        await cartPage.waitForPaymentConfirmationButton();
    
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
        await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
        await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
        await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
        await expect(paymentsPage.getBackHomeButton).toBeVisible();
    
        await paymentsPage.clickOrderDetailsButton();
    
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
    
        await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
    
        const productNames = await orderDetailsPage.getProductNames.all();
        const productQuantities = await orderDetailsPage.getProductQuantity.all();
    
        const initialProducts: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNames.length; i++) {
        const name = await productNames[i].textContent();
        const quantity = await productQuantities[i].textContent();
        
        initialProducts.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
          await page.waitForTimeout(1000);
        }
    
        console.log(initialProducts);
        
        await orderDetailsPage.clickEditOrderButton();
        await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
        await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
        await orderEditPage.clickApplyEditOrderModalButton();
        await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
      
        await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
        await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
    
        await page.goto('/koszyk', { waitUntil: 'load'});
        await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    
        const productNamesCart = await cartPage.getProductNames.all();
        const productQuantitiesCart = await cartPage.getProductQuantities.all();
    
        const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNamesCart.length; i++) {
          const name = await productNamesCart[i].textContent();
          const quantity = await productQuantitiesCart[i].inputValue();
          
          initialProductsCart.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
        }
    
        console.log(initialProductsCart);
    
        expect(initialProducts).toEqual(initialProductsCart);
    
        await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
        await page.waitForTimeout(5000);
    
        const productNamesCartAfterChanges = await cartPage.getProductNames.all();
        const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
    
        const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
    
        for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
          const name = await productNamesCartAfterChanges[i].textContent();
          const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
          
          initialProductsCartAfterChanges.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
        }
    
        console.log(initialProductsCartAfterChanges);
    
        const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
            .replace(/[^0-9,.]/g, '')
            .replace(',', '.'));
    
        console.log(summaryPriceAfterChanges);
    
        const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
        console.log('Różnica w cenie:', priceDifference);
  
        await cartPage.clickCartSummaryButton();
  
        await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
        await cartPage.clickCartSummaryPaymentButton();
  
        await page.getByLabel('Przelew online').check();
        await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
        await orderEditPage.clickApplyEditOrderCartButton();
    
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
        const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`});
        await expect(button).toBeVisible({ timeout: 5000 });
        await page.mouse.move(960, 540);
        await page.mouse.wheel(0, 1500);
        await page.waitForTimeout(700);
        await button.click({ force: true });
  
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
        await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
        await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
        await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
        await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
        await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
        await paymentsPage.clickOrderDetailsButton();
        await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
        await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
        await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
        
        await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
        const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
        const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
        const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
        for (let i = 0; i < productNamesAfterEdit.length; i++) {
        const name = await productNamesAfterEdit[i].textContent();
        const quantity = await productQuantitiesAfterEdit[i].textContent();
        
        initialProductsAfterEdit.push({
            name: name?.trim(),
            quantity: parseFloat(quantity?.trim() || '0'),
          });
          await page.waitForTimeout(1000);
        }
  
        console.log(initialProductsAfterEdit);
  
        expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
        expect(productNamesAfterEdit.length).toBe(1);
  
        await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Przelewy24');
    
        const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
        expect(finalPrice).toBe(summaryPriceAfterChanges);
      })

    test('W | Zwrot środków z BLIK na kartę przy odbiorze', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia ze zwrotem środków');
      await allure.allureId('2484');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodBlik).check();
      await paymentsPage.enterBlikCode(paymentMethodBlikCode);
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodCard).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Płatność kartą przy odbiorze');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Zwrot środków z przelewu na BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia ze zwrotem środków');
      await allure.allureId('2485'); 

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodPrzelewy24).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodBlik).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Blik');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })
    
    test('W | Zwrot środków z przelewu na zapłatę kartą przy odbiorze', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia ze zwrotem środków');
      await allure.allureId('2486');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodPrzelewy24).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodCard).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Płatność kartą przy odbiorze');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Zwrot środków z zapłaty kartą przy odbiorze na BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia ze zwrotem środków');
      await allure.allureId('2487');

      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodCard).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodBlik).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });

      await expect(orderEditPage.getEnterBlikCodeModalTitle).toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getEnterBlikCodeModalInput).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeVisible({ timeout: 5000 });
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).toBeDisabled();
      await orderEditPage.getEnterBlikCodeModalInput.fill(paymentMethodBlikCode);
      await expect(orderEditPage.getEnterBlikCodeModalPayButton).not.toBeDisabled({ timeout: 5000 });
      await orderEditPage.getEnterBlikCodeModalPayButton.click();
      await expect(orderEditPage.getEnterBlikCodeModalTitle).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).not.toBeVisible({ timeout: 15000 });
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Blik');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })

    test('W | Zwrot środków z zapłaty kartą przy odbiorze na przelew', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, addProduct }) => {

      await allure.tags('Web', 'Edycja zamówienia');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy edycji zamówienia');
      await allure.subSuite('Edycja zamówienia ze zwrotem środków');
      await allure.allureId('2488');
      
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await expect(page).toHaveURL(`${baseURL}` + '/koszyk');
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});
  
      await cartPage.clickCartSummaryButton();
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().click();
      await cartPage.clickCartSummaryPaymentButton();
      await page.getByLabel(paymentMethodCard).check();
      await paymentsPage.checkStatue();
      const summaryPrice = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
      .replace(/[^0-9,.]/g, '')
      .replace(',', '.'));
      console.log(summaryPrice);
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getEditOrderButton).toBeVisible({ timeout: 10000 });
  
      const productNames = await orderDetailsPage.getProductNames.all();
      const productQuantities = await orderDetailsPage.getProductQuantity.all();
  
      const initialProducts: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNames.length; i++) {
      const name = await productNames[i].textContent();
      const quantity = await productQuantities[i].textContent();
      
      initialProducts.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProducts);
      
      await orderDetailsPage.clickEditOrderButton();
      await expect(orderEditPage.getEditOrderModalTitle).toBeVisible({ timeout: 10000 });
      await expect(orderEditPage.getApplyEditOrderModalButton).toBeVisible({ timeout: 10000 });
      await orderEditPage.clickApplyEditOrderModalButton();
      await expect(orderEditPage.getEditOrderModalTitle).not.toBeVisible({ timeout: 10000 });
    
      await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 10000 });
      await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 10000 });
  
      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
  
      const productNamesCart = await cartPage.getProductNames.all();
      const productQuantitiesCart = await cartPage.getProductQuantities.all();
  
      const initialProductsCart: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCart.length; i++) {
        const name = await productNamesCart[i].textContent();
        const quantity = await productQuantitiesCart[i].inputValue();
        
        initialProductsCart.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCart);
  
      expect(initialProducts).toEqual(initialProductsCart);
  
      await page.locator('div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
      await page.waitForTimeout(5000);
  
      const productNamesCartAfterChanges = await cartPage.getProductNames.all();
      const productQuantitiesCartAfterChanges = await cartPage.getProductQuantities.all();
  
      const initialProductsCartAfterChanges: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesCartAfterChanges.length; i++) {
        const name = await productNamesCartAfterChanges[i].textContent();
        const quantity = await productQuantitiesCartAfterChanges[i].inputValue();
        
        initialProductsCartAfterChanges.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
      }
  
      console.log(initialProductsCartAfterChanges);
  
      const summaryPriceAfterChanges = parseFloat((await cartPage.getTotalSummaryValue.textContent() || '0')
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.'));
  
      console.log(summaryPriceAfterChanges);
  
      const priceDifference = Math.abs((summaryPriceAfterChanges - summaryPrice)).toFixed(2).replace(/\.?0+$/, '');
      console.log('Różnica w cenie:', priceDifference);

      await cartPage.clickCartSummaryButton();

      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await cartPage.clickCartSummaryPaymentButton();

      await page.getByLabel(paymentMethodPrzelewy24).check();
      await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
      await orderEditPage.clickApplyEditOrderCartButton();
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`});
      await expect(button).toBeVisible({ timeout: 5000 });
      await page.mouse.move(960, 540);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(700);
      await button.click({ force: true });

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
      await page.waitForTimeout(1000);

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;

      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }

      expect(urlChanged).toBe(true);

      await przelewy24Page.clickBackToShopButton();
      await page.waitForTimeout(2000);
  
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 30000 });
      await expect(page.getByText('Edytowano zamówienie', { exact: true })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
  
      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
  
      await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
      await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
      
      await expect(orderDetailsPage.getEditOrderButton).not.toBeVisible({ timeout: 10000 });
  
      const productNamesAfterEdit = await orderDetailsPage.getProductNames.all();
      const productQuantitiesAfterEdit = await orderDetailsPage.getProductQuantity.all();
  
      const initialProductsAfterEdit: { name: string | undefined; quantity: number; }[] = [];
  
      for (let i = 0; i < productNamesAfterEdit.length; i++) {
      const name = await productNamesAfterEdit[i].textContent();
      const quantity = await productQuantitiesAfterEdit[i].textContent();
      
      initialProductsAfterEdit.push({
          name: name?.trim(),
          quantity: parseFloat(quantity?.trim() || '0'),
        });
        await page.waitForTimeout(1000);
      }
  
      console.log(initialProductsAfterEdit);
  
      expect(initialProductsCartAfterChanges).toEqual(initialProductsAfterEdit);
  
      expect(productNamesAfterEdit.length).toBe(1);

      await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Przelewy24');

      const finalPrice = parseFloat((await page.getByText('Kwota').locator('..').locator('div').last().textContent() || '0')
        .replace(/[^0-9,.]/g, '')
        .replace(',', '.'));
      expect(finalPrice).toBe(summaryPriceAfterChanges);
    })
  })
})
*/
