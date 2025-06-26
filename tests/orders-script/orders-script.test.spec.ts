import { firefox } from 'playwright';
import * as utility from '../../utils/utility-methods';
import { getNextFreeAddress, loadJson } from './orders-methods';
import * as utilityOrders from './orders-methods';
import { expect, test } from '@playwright/test';
import LoginPage from '../../page/Login.page';
import CommonPage from '../../page/Common.page';
import SearchbarPage from '../../page/Searchbar.page';
import CartPage from '../../page/Cart.page';
import DeliveryPage from '../../page/Delivery.page';
import PaymentsPage from '../../page/Payments.page';

type User = { email: string; password: string };
type Address = { city: string; street: string; house_number: string; postal_code: string; phone_number: string };

const USERS_FILE = './tests/orders-script/users.json';

async function processUser(user: User, address: Address) {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const searchbarPage = new SearchbarPage(page);
  const cartPage = new CartPage(page);
  const deliveryPage = new DeliveryPage(page);
  const paymentsPage = new PaymentsPage(page);

  page.on('framenavigated', async () => {
    await utility.addGlobalStyles(page);
  });

  let product = 'janex polędwica wołowa';
  const response = await page.request.get(`${process.env.URL}`);
  const maxRetries = 5;
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    try {
      const response = await page.goto(`${process.env.URL}/logowanie`, { waitUntil: 'domcontentloaded' });
      if (response && response.status() === 200) {
        success = true;
      } else {
        throw new Error(`Otrzymano status ${response?.status()}`);
      }
    } catch (error) {
      if (error.message.includes('503')) {
        console.log(`Otrzymano 503, próba ${attempt + 1} z ${maxRetries}`);
        await page.waitForTimeout(1000);
        attempt++;
      } else {
        throw error;
      }
    }
  }

  if (!success) {
    throw new Error('Zbyt wiele prób, serwer nadal zwraca 503 lub inny błąd');
  }

  await page.waitForTimeout(2000);

  await page.fill('#login_email', user.email);

  await utilityOrders.fillPassword(page, user.password);

  await expect(loginPage.getLoginButton).toBeEnabled({ timeout: 5000 });
  await page.waitForTimeout(1000);
  await loginPage.clickLoginButton();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${process.env.URL}`, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');
  await utility.addGlobalStyles(page);
  await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 15000 });

  await page.evaluate(async (address) => {
    await fetch(`${process.env.URL}/api/delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
  }, address);

  console.log(`✅ Adres dodany dla: ${user.email}`);

  await searchbarPage.clickSearchbar();
  await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
  await searchbarPage.enterProduct(product);
  await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.locator("div[data-testid='search-results'] div[data-sentry-component='ProductCard'] button:has-text('Dodaj')").first().click({ force: true, delay: 300 });
  await page.waitForTimeout(4000);

  await searchbarPage.getProductItemCount.first().click();
  await page.waitForTimeout(1000);
  await searchbarPage.getProductItemCount.first().type('1');
  await commonPage.getCartButton.click();
  await page.waitForTimeout(1000);

  await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
  await cartPage.clickCartDrawerToCartButton();
  await expect(page.getByRole('button', { name: 'Przejdź do dostawy' })).toBeVisible({ timeout: 15000 });
  await page.waitForSelector("div[data-sentry-element='InsideWrapper']", { timeout: 10000 });
  await cartPage.clickCartSummaryButton();
  await page.waitForSelector("button[data-sentry-component='DeliverySlotItem']", { timeout: 10000 });
  await deliveryPage.getDeliverySlotButton.first().click();
  await cartPage.clickCartSummaryPaymentButton();
  await page.getByLabel('Płatność kartą przy odbiorze').check();
  await paymentsPage.checkStatue();
  await cartPage.clickCartPaymentConfirmationButton();
  await page.waitForSelector("#cart_summary_payment_confirmation", { timeout: 15000, state: 'hidden' });

  await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

  await browser.close();
}

test.describe('Orders Script', () => {
  test('Proces dodawania adresów dla użytkowników', async () => {
    const users: User[] = await loadJson(USERS_FILE);

    for (const user of users) {
      const address = await getNextFreeAddress();
      if (!address) {
        console.log('❌ Brak wolnych adresów!');
        break;
      }

      try {
        await processUser(user, address);
      } catch (err) {
        console.error(`❗ Błąd dla ${user.email}:`, err);
      }
    }
  });
});
