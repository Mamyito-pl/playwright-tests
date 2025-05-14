import { expect } from '@playwright/test';
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

    await page.goto('/', { waitUntil: 'load'})

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
  
  test.afterEach(async ({ deleteDeliveryAddressViaAPI }) => {
    await deleteDeliveryAddressViaAPI('Adres Testowy');
  }) 

  test.describe('Edycja zamówienia z dopłatą', async () => {

    test('M | Dopłata do zamówienia z pełną manipulacją produktów w koszyku', async ({ page, baseURL }) => {
        
    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(150000);

    await searchbarPage.getSearchbarInput.click();
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
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
    await cartPage.clickCartPaymentConfirmationButtonButton();
    await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible();
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

    const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
    const notificationButtonIsVisible = await notificationButton.isVisible();

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }

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

    await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().scrollIntoViewIfNeeded();
    await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
    await page.waitForTimeout(5000);

    const inputToIncrease = await page.locator('div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
    for (let i = 0; i < inputToIncrease.length; i++) {
        const value = await inputToIncrease[i].inputValue();
        if (value === '1') {
            await inputToIncrease[i].scrollIntoViewIfNeeded();
            await inputToIncrease[i].click();
            await inputToIncrease[i].fill('10');
            await page.waitForTimeout(5000);
            break;
        }
    }

    const inputToDelete = await page.locator('div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
    for (let i = 0; i < inputToDelete.length; i++) {
        const value = await inputToDelete[i].inputValue();
        if (value === '1') {
            await page.locator(selectors.CartPage.common.deleteProductCartIcon).nth(i).scrollIntoViewIfNeeded();
            await page.locator(selectors.CartPage.common.deleteProductCartIcon).nth(i).click();
            await expect(cartPage.getProductCartConfirmButton).toBeVisible({ timeout: 15000 });
            await cartPage.clickDeleteProductCartConfirmButton();
            await page.waitForTimeout(1000);
            break;
        }
    }

    await page.goto('/wyprzedaz', { waitUntil: 'load'});
    await expect(productsListPage.getProductCategoryTitle('Wyprzedaż')).toBeVisible({ timeout: 15000 });
      
    const maxTriesForClick = 5;

    for (let i = 0; i < maxTriesForClick; i++) {
      await productsListPage.getProductTiles.first().getByText('Dodaj').scrollIntoViewIfNeeded();
      await productsListPage.getProductTiles.first().getByText('Dodaj').click({ force: true });
      await page.waitForTimeout(5000);
      const isVisible = await page.locator(selectors.ProductsListPage.common.productCardIncreaseButton).isVisible();
      if (isVisible === true) {
        break;
      }
    }
    
    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });

    if (notificationButtonIsVisible) {
      await notificationButton.click();
    } else {
      return;
    }

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
    await expect(orderEditPage.getApplyEditOrderCartButton).toBeVisible({ timeout: 50000 });
    await orderEditPage.clickApplyEditOrderCartButton();

    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
    const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`}).nth(1);
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
    await expect(orderEditPage.getEnterBlikCodeModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
    await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });

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

    test('M | Dopłata do zamówienia z BLIK na przelew', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();
  
      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }
  
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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`}).nth(1);
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

    test('M | Dopłata do zamówienia z BLIK na kartę przy odbiorze', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }
  
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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`}).nth(1);
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

    test('M | Dopłata do zamówienia z przelewu na BLIK', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }
  
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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`}).nth(1);
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
      await expect(orderEditPage.getEnterBlikCodeModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
  
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

    test('M | Dopłata do zamówienia z przelewu na kartę przy odbiorze', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

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
      
      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }
  
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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do dopłaty ${priceDifference} zł`}).nth(1);
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

    test('M | Dopłata do zamówienia z karty przy odbiorze na BLIK', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`}).nth(1);
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
      await expect(orderEditPage.getEnterBlikCodeModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
  
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

    test('M | Dopłata do zamówienia z karty przy odbiorze na przelew', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`}).nth(1);
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

    test('M | Zwrot środków zamówienia z pełną manipulacją produktów w koszyku', async ({ page, baseURL }) => {
        
        test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
        test.setTimeout(150000);
    
        await searchbarPage.getSearchbarInput.click();
        await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
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
        await cartPage.clickCartPaymentConfirmationButtonButton();
        await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

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

        const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
        const notificationButtonIsVisible = await notificationButton.isVisible();

        if (notificationButtonIsVisible) {
          await notificationButton.click();
        } else {
          return;
        }

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
    
        await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
        await page.waitForTimeout(5000);
    
        const inputToIncrease = await page.locator('div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
        for (let i = 0; i < inputToIncrease.length; i++) {
            const value = await inputToIncrease[i].inputValue();
            if (value === '1') {
                await inputToIncrease[i].click();
                await inputToIncrease[i].fill('2');
                await page.waitForTimeout(5000);
                break;
            }
        }
    
        const inputToDelete = await page.locator('div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input').all();
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
    
        const maxTriesForClick = 5;

        for (let i = 0; i < maxTriesForClick; i++) {
          await productsListPage.getProductTiles.first().getByText('Dodaj').scrollIntoViewIfNeeded();
          await productsListPage.getProductTiles.first().getByText('Dodaj').click({ force: true });
          await page.waitForTimeout(5000);
          const isVisible = await page.locator(selectors.ProductsListPage.common.productCardIncreaseButton).isVisible();
          if (isVisible === true) {
            break;
          }
        }
        
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
    
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
        const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`}).nth(1);
        await expect(button).toBeVisible({ timeout: 5000 });
        await page.mouse.move(960, 540);
        await page.mouse.wheel(0, 1500);
        await page.waitForTimeout(700);
        await button.click({ force: true });
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
    
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

    test('M | Zwrot środków z BLIK na przelew', async ({ page, baseURL, addProduct }) => {
          
        test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
        test.setTimeout(150000);
    
        await addProduct(product);
    
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
        await cartPage.clickCartPaymentConfirmationButtonButton();
        await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
    
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
        const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
        const notificationButtonIsVisible = await notificationButton.isVisible();

        if (notificationButtonIsVisible) {
          await notificationButton.click();
        } else {
          return;
        }

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
    
        await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
    
        await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
        const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`}).nth(1);
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

    test('M | Zwrot środków z BLIK na kartę przy odbiorze', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`}).nth(1);
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

    test('M | Zwrot środków z przelewu na BLIK', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`}).nth(1);
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
    
    test('M | Zwrot środków z przelewu na zapłatę kartą przy odbiorze', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });

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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zwrotu ${priceDifference} zł`}).nth(1);
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

    test('M | Zwrot środków z zapłaty kartą przy odbiorze na BLIK', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`}).nth(1);
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
      await expect(orderEditPage.getEnterBlikCodeModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).not.toBeVisible({ timeout: 15000 });
  
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

    test('M | Zwrot środków z zapłaty kartą przy odbiorze na przelew', async ({ page, baseURL, addProduct }) => {
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
      
      test.setTimeout(150000);
  
      await addProduct(product);
  
      await searchbarPage.getProductItemCount.first().click({ force: true });
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
  
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
      await cartPage.clickCartPaymentConfirmationButtonButton();
      await page.waitForSelector(selectors.CartPage.common.cartSummaryPaymentConfirmationButton, { timeout: 15000, state: 'hidden' });
  
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

      const notificationButton = page.getByText('Produkty dodane do koszyka nie są zarezerwowane').locator('..').locator('..').locator('button');
      const notificationButtonIsVisible = await notificationButton.isVisible();

      if (notificationButtonIsVisible) {
        await notificationButton.click();
      } else {
        return;
      }

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
  
      await page.locator('div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]').first().click();
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
  
      await expect(orderEditPage.getConfirmationEditOrderCartModalTitle.nth(0)).toBeVisible({ timeout: 15000 });
      const button = page.getByRole('button', { name: `Do zapłaty ${summaryPriceAfterChanges} zł`}).nth(1);
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

