import { expect } from '@playwright/test';
import OrdersPage from '../../../page/Profile/OrdersList.page.ts'; 
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';
import ProfilePage from '../../../page/Profile/Profile.page.ts';
import MainPage from '../../../page/Main.page.ts';
import MyDetailsPage from '../../../page/Profile/MyDetails.page.ts';
import DeliveryAddressesPage from '../../../page/Profile/DeliveryAddresses.page.ts';
import InvoiceAddressesPage from '../../../page/Profile/InvoiceAddresses.page.ts';
import FavouritesPage from '../../../page/Profile/Favourites.page.ts';
import RebateCodesPage from '../../../page/Profile/RebateCodes.page.ts';
import NonLoggedUserPage from '../../../page/NonLoggedUser.page.ts';

test.setTimeout(80000);

test.describe('Testy profilu', async () => {
  let profilePage: ProfilePage;
  let mainPage: MainPage;
  let ordersPage: OrdersPage;
  let myDetailsPage: MyDetailsPage;
  let deliveryAddressesPage: DeliveryAddressesPage;
  let invoiceAddressesPage: InvoiceAddressesPage;
  let favouritesPage: FavouritesPage;
  let rebateCodesPage: RebateCodesPage;
  let nonLoggedUserPage: NonLoggedUserPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);
    
    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    profilePage = new ProfilePage(page);
    mainPage = new MainPage(page);
    ordersPage = new OrdersPage(page);
    myDetailsPage = new MyDetailsPage(page);
    deliveryAddressesPage = new DeliveryAddressesPage(page);
    invoiceAddressesPage = new InvoiceAddressesPage(page);
    favouritesPage = new FavouritesPage(page);
    rebateCodesPage = new RebateCodesPage(page);
    nonLoggedUserPage = new NonLoggedUserPage(page);
  })
  
  test('W | Po kliknięciu w profil wyświetla się menu ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {
    
    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy profilu');
    await allure.subSuite('');
    await allure.allureId('2576');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await mainPage.getProfileButton.click();
    await expect(profilePage.getProfileMenuTitle).toBeVisible();
    await expect(profilePage.getProfileMenuLoggedUser).toBeVisible();
    await expect(profilePage.getProfileMenuOrdersButton).toBeVisible();
    await expect(profilePage.getProfileRebateCodesButton).toBeVisible();
    await expect(profilePage.getProfileMenuMyDetailsButton).toBeVisible();
    await expect(profilePage.getProfileMenuDeliveryAddressesButton).toBeVisible();
    await expect(profilePage.getProfileMenuInvoiceAddressesButton).toBeVisible();
    await expect(profilePage.getProfileMenuFavouritesButton).toBeVisible();
    await expect(profilePage.getProfileMenuLogOutButton).toBeVisible();
  })
    
  test('W | Po kliknięciu poza modal profilu, modal się zamyka', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {
    
    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy profilu');
    await allure.subSuite('');
    await allure.allureId('2577');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await mainPage.getProfileButton.click();
    await expect(profilePage.getProfileMenuTitle).toBeVisible();
    await mainPage.getProfileButton.click({ force: true });
    await expect(profilePage.getProfileMenuTitle).not.toBeVisible({ timeout: 5000 });
  })

  test.describe('Przekierowania z modala profilu', () => {
    
    test('W | Po kliknięciu "Zamówienia" w modalu profilu użytkownik jest przekierowywany do listy zamówień', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2578');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileMenuOrdersButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia', { timeout: 15000 });
      await expect(ordersPage.getOrdersTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    })

    test('W | Po kliknięciu "Kody rabatowe" w modalu profilu użytkownik jest przekierowywany do listy kodów rabatowych', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2579');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileRebateCodesButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/kody-rabatowe', { timeout: 15000 });
      await expect(rebateCodesPage.getRebateCodesTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    })

    test('W | Po kliknięciu "Moje dane" w modalu profilu użytkownik jest przekierowywany do sekcji moich danych', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2580');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileMenuMyDetailsButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/moje-dane', { timeout: 15000 });
      await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    })

    test('W | Po kliknięciu "Adresy dostaw" w modalu profilu użytkownik jest przekierowywany do sekcji adresów dostaw', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2581');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileMenuDeliveryAddressesButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/adresy-dostaw', { timeout: 15000 });
      await expect(deliveryAddressesPage.getDeliveryAddressesTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    })

    test('W | Po kliknięciu "Dane do faktury" w modalu profilu użytkownik jest przekierowywany do sekcji danych do faktury', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2582');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileMenuInvoiceAddressesButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/dane-faktury', { timeout: 15000 });
      await expect(invoiceAddressesPage.getInvoiceAddressTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    })

    test('W | Po kliknięciu "Ulubione" w modalu profilu użytkownik jest przekierowywany do sekcji ulubionych produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2583');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await profilePage.getProfileMenuFavouritesButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/ulubione-produkty', { timeout: 15000 });
      await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuLoggedUser).not.toBeVisible();
    }) 
  
    test('W | Po kliknięciu "Wyloguj się" w modalu profilu użytkownik jest zostaje wylogowany', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, baseURL }) => {
    
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z modala profilu');
      await allure.allureId('2584');

      await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
      await mainPage.getProfileButton.click();
      await expect(profilePage.getProfileMenuTitle).toBeVisible();
      await expect(profilePage.getProfileMenuLogOutButton).toBeVisible();
      await profilePage.getProfileMenuLogOutButton.click();
      await expect(nonLoggedUserPage.getDeliveryAvailableLink).toBeVisible({ timeout: 10000 });
      await expect(nonLoggedUserPage.getLoginLink).toBeVisible({ timeout: 10000 });
      await expect(nonLoggedUserPage.getRegisterLink).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuTitle).not.toBeVisible({ timeout: 10000 });
      await expect(page).toHaveURL(`${baseURL}`, { timeout: 10000 });
    })
  })

  test.describe('Przekierowania z profilu', () => {
    
    test('W | Po kliknięciu "Zamówienia" z profilu użytkownik jest przekierowywany do listy zamówień', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2585');

      await utility.gotoWithRetry(page, '/profil/kody-rabatowe');
      await expect(rebateCodesPage.getRebateCodesTitle).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuOrdersButton).toBeVisible();
      await profilePage.getProfileMenuOrdersButton.click();
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia', { timeout: 15000 });
      await expect(ordersPage.getOrdersTitle).toBeVisible({ timeout: 10000 });
    })

    test('W | Po kliknięciu "Kody rabatowe" z profilu użytkownik jest przekierowywany do listy kodów rabatowych', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2586');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileRebateCodesButton).toBeVisible();
      await profilePage.getProfileRebateCodesButton.click();  
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/kody-rabatowe', { timeout: 15000 });
      await expect(rebateCodesPage.getRebateCodesTitle).toBeVisible({ timeout: 10000 });
    })

    test('W | Po kliknięciu "Moje dane" z profilu użytkownik jest przekierowywany do sekcji moich danych', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2587');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileMenuMyDetailsButton).toBeVisible();
      await profilePage.getProfileMenuMyDetailsButton.click();  
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/moje-dane', { timeout: 15000 });
      await expect(myDetailsPage.getMyDetailsTitle).toBeVisible({ timeout: 10000 });
    })

    test('W | Po kliknięciu "Adresy dostaw" z profilu użytkownik jest przekierowywany do sekcji adresów dostaw', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2588');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileMenuDeliveryAddressesButton).toBeVisible();
      await profilePage.getProfileMenuDeliveryAddressesButton.click();  
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/adresy-dostaw', { timeout: 15000 });
      await expect(deliveryAddressesPage.getDeliveryAddressesTitle).toBeVisible({ timeout: 10000 });
    })

    test('W | Po kliknięciu "Dane do faktury" z profilu użytkownik jest przekierowywany do sekcji danych do faktury', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2589');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileRebateCodesButton).toBeVisible();
      await profilePage.getProfileMenuInvoiceAddressesButton.click();  
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/dane-faktury', { timeout: 15000 });
      await expect(invoiceAddressesPage.getInvoiceAddressTitle).toBeVisible({ timeout: 10000 });
    })

    test('W | Po kliknięciu "Ulubione" z profilu użytkownik jest przekierowywany do sekcji ulubionych', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
      
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2590');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileMenuFavouritesButton).toBeVisible();
      await profilePage.getProfileMenuFavouritesButton.click();  
      await page.waitForLoadState('load');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/ulubione-produkty', { timeout: 15000 });
      await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible({ timeout: 10000 });
    })
      
    test('W | Po kliknięciu "Wyloguj się" z profilu użytkownik jest zostaje wylogowany', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
    
      await allure.tags('Web', 'Profil');
      await allure.epic('Webowe');
      await allure.parentSuite('Profil');
      await allure.suite('Testy profilu');
      await allure.subSuite('Przekierowania z profilu');
      await allure.allureId('2591');

      await utility.gotoWithRetry(page, '/profil/zamowienia');
      await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne', { timeout: 15000 });
      await expect(profilePage.getProfileMenuLogOutButton).toBeVisible();
      await profilePage.getProfileMenuLogOutButton.click();
      await expect(nonLoggedUserPage.getDeliveryAvailableLink).toBeVisible({ timeout: 10000 });
      await expect(nonLoggedUserPage.getLoginLink).toBeVisible({ timeout: 10000 });
      await expect(nonLoggedUserPage.getRegisterLink).toBeVisible({ timeout: 10000 });
      await expect(profilePage.getProfileMenuTitle).not.toBeVisible({ timeout: 10000 });
      await expect(page).toHaveURL(`${baseURL}`, { timeout: 10000 });
    })
  })
})
