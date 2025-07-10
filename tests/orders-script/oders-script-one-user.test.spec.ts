import { chromium, firefox } from 'playwright';
import * as utility from '../../utils/utility-methods';
import { getNextFreeAddress, loadJson, clearCartViaAPI, addDeliveryAddressViaAPI } from './orders-methods';
import * as utilityOrders from './orders-methods';
import { expect, test } from './orders-methods';
import LoginPage from '../../page/Login.page';
import CommonPage from '../../page/Common.page';
import SearchbarPage from '../../page/Searchbar.page';
import CartPage from '../../page/Cart.page';
import DeliveryPage from '../../page/Delivery.page';
import PaymentsPage from '../../page/Payments.page';

type User = { email: string; password: string };
type Address = { city: string; street: string; house_number: string; postal_code: string; phone_number: string; first_name: string; last_name: string };

const USERS_FILE = './tests/orders-script/users.json';

async function processUser(user: User) {
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
  //await addDeliveryAddressViaAPI(page, address, 'test', user);
  await expect(page).toHaveURL(`${process.env.URL}`, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');
  await utility.addGlobalStyles(page);
  await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 15000 });

  await searchbarPage.clickSearchbar();
  await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
  await searchbarPage.enterProduct(product);
  await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.locator("div[data-testid='search-results'] div[data-sentry-component='ProductCard'] button:has-text('Dodaj')").first().click({ force: true, delay: 300 });
  await page.waitForTimeout(1500);

  await searchbarPage.getProductItemCount.first().click();
  await page.waitForTimeout(500);
  await searchbarPage.getProductItemCount.first().type('1');
  await commonPage.getCartButton.click();

  /*await page.goto('/mrozonki-i-lody-2', { waitUntil: 'domcontentloaded'});
  for (let i = 0; i < 2; i++) {
    await page.locator("div[data-sentry-component='ProductCard'] button:has-text('Dodaj')").first().click({ force: true, delay: 300 });
    await page.waitForTimeout(3000);
  }
  await page.goto('/piekarnia-i-cukiernia', { waitUntil: 'domcontentloaded'});
  for (let i = 0; i < 2; i++) {
    await page.locator("div[data-sentry-component='ProductCard'] button:has-text('Dodaj')").first().click({ force: true, delay: 300 });
    await page.waitForTimeout(3000);
  }
  await page.goto('/chemia-i-srodki-czystosci', { waitUntil: 'domcontentloaded'});
  for (let i = 0; i < 2; i++) {
    await page.locator("div[data-sentry-component='ProductCard'] button:has-text('Dodaj')").first().click({ force: true, delay: 300 });
    await page.waitForTimeout(3000);
  }*/
  //await commonPage.getCartButton.click({ force: true });
  await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
  await cartPage.clickCartDrawerToCartButton();
  await page.waitForSelector("div[data-sentry-element='InsideWrapper']", { timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Przejdź do dostawy' })).toBeVisible({ timeout: 15000 });
  await cartPage.clickCartSummaryButton();
  //await page.waitForSelector("button[data-sentry-component='DeliverySlotItem']", { timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Zarezerwuj termin' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Zarezerwuj termin' })).toBeEnabled({ timeout: 10000 });
  await page.getByRole('button', { name: 'Zarezerwuj termin' }).click();
  // przycisk edycji adresu
  /*await page.locator('#__next > main > div > div.sc-b2e34c36-1.gBsBzR > div.sc-b2e34c36-2.ha-dfdF > div.sc-7bf558d8-0.daBIjg > div.sc-e7f63802-0.ctcwVS > div.sc-e7f63802-5.csnSFh > div.sc-4ba0a65-1.khxMBL > div > svg').click();
  await page.locator('#delivery_address_save_button').click();
  await page.waitForTimeout(5000);
  const confirmModal = page.locator('#modal-portal > div:nth-child(2) > div');
  
  if (await confirmModal.isVisible({ timeout: 15000 })) {
    console.log('Modal potwierdzenia adresu jest widoczny - klikam "Popraw adres"');
    await confirmModal.getByRole('button', { name: 'Popraw adres' }).click();
    await page.locator('#delivery_address_save_button').click();
  } else {
    console.log('Modal potwierdzenia adresu nie jest widoczny - kontynuuję');
  }*/
  await expect(page.getByText('11 lip')).toBeVisible({ timeout: 10000 });
  await page.getByText('11 lip').click();
  await page.getByText('11 lip').click();
  //selektory do slotu
  await page.locator('div[class*="sc-2a32734a"] div[class*="biOiAb"] label').first().scrollIntoViewIfNeeded();
  await expect(page.locator('div[class*="sc-2a32734a"] div[class*="biOiAb"] label').first()).toBeVisible({ timeout: 10000 });
  await page.locator('div[class*="sc-2a32734a"] div[class*="biOiAb"] label').first().click({ force: true });
  await expect(page.getByRole('button', { name: 'Zapisz rezerwacje' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Zapisz rezerwacje' })).toBeEnabled({ timeout: 10000 });
  await page.getByRole('button', { name: 'Zapisz rezerwacje' }).click();
  await cartPage.clickCartSummaryPaymentButton();
  await page.getByLabel('Płatność kartą przy odbiorze').check({ force: true });
  await paymentsPage.checkStatue();
  await page.waitForTimeout(300);
  await cartPage.clickCartPaymentConfirmationButton();
  await page.waitForSelector("#cart_summary_payment_confirmation", { timeout: 15000, state: 'hidden' });

  await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
  
  await browser.close();
}

test.describe('Orders Script', () => {

  test.setTimeout(50000000);

  test('Proces dodawania adresów dla użytkowników', async () => {
    const users: User[] = await loadJson(USERS_FILE);

    if (users.length === 0) {
      throw new Error('❌ Brak użytkowników w pliku users.json!');
    }

    console.log(`📊 Załadowano ${users.length} użytkowników z pliku ${USERS_FILE}`);
    console.log(`🎯 Skrypt wykona się dokładnie 5 razy`);

    for (let i = 0; i < 400; i++) {
      const userIndex = i % users.length;
      const user = users[userIndex];

      console.log(`🔄 Wykonanie ${i + 1}/x - Używam użytkownika: ${user.email} (indeks: ${userIndex})`);
      
      try {
        await processUser(user);
        console.log(`✅ Zakończono pomyślnie wykonanie`);
      } catch (err) {
        console.error(`❗ Błąd w wykonaniu ${i + 1}/5 dla ${user.email}:`, err);
      }
    }
    
    console.log(`🏁 Zakończono wszystkie 5 wykonań skryptu`);
  });
});
