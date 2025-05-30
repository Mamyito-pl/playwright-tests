import { expect } from '@playwright/test';
import MainPage from '../../page/Main.page.ts';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import SearchbarPage from '../../page/Searchbar.page.ts';
import CartPage from '../../page/Cart.page.ts';
import ProductsListPage from '../../page/ProductsList.page.ts';
import ProductsCategoriesPage from '../../page/ProductsCategories.page.ts';
import FavouritesPage from '../../page/Profile/Favourites.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods.ts';
import CommonPage from '../../page/Common.page.ts';

test.setTimeout(120000);

test.describe('Testy strony głównej', async () => {

  let mainPage: MainPage;
  let menuCategoriesPage: MenuCategoriesPage;
  let searchbarPage: SearchbarPage;
  let cartPage: CartPage;
  let productsListPage: ProductsListPage;
  let productsCategoriesPage: ProductsCategoriesPage;
  let favouritesPage: FavouritesPage;
  let commonPage: CommonPage;

  test.beforeEach(async ({ page }) => {
    
    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    mainPage = new MainPage(page);
    menuCategoriesPage = new MenuCategoriesPage(page);
    searchbarPage = new SearchbarPage(page);
    cartPage = new CartPage(page);
    productsListPage = new ProductsListPage(page)
    productsCategoriesPage = new ProductsCategoriesPage(page)
    favouritesPage = new FavouritesPage(page)
    commonPage = new CommonPage(page)
  })

  test('W | Strona główna otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1177');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(700);

    await expect(mainPage.getLogo).toBeVisible();
    await expect(searchbarPage.getSearchbarInput).toBeVisible()
    await expect(mainPage.getDeliveryButton).toBeVisible();
    await expect(mainPage.getProfileButton).toBeVisible();
    await expect(cartPage.getCartDrawerButton).toBeVisible();

    await expect(menuCategoriesPage.getMenuCategoriesButton).toBeVisible();
    await expect(mainPage.getStrefaMamityButton).toBeVisible();
    await expect(mainPage.getDiscountsButton).toBeVisible();
    await expect(mainPage.getNewProductsButton).toBeVisible();
    await expect(mainPage.getBestsellersButton).toBeVisible();
    await expect(mainPage.getFavouritesButton).toBeVisible();
    await expect(mainPage.getRecentlyBoughtButton).toBeVisible();
    await expect(mainPage.getAboutDeliveryButton).toBeVisible();
    await expect(mainPage.getPaymentMethodsButton).toBeVisible();

    await expect(mainPage.getBanerSlider).toBeVisible();
    await expect(mainPage.getBannerUpperUp).toBeVisible();
    
    if (process.env.URL === 'https://mamyito-front.test.desmart.live') {
      await expect(mainPage.getBannerUpperDown).toBeVisible();
    }

    await expect(mainPage.getSectionTitle('Promocje')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('promocje')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await mainPage.getSectionShowAllLink('bestsellery').scrollIntoViewIfNeeded();
    await expect(mainPage.getSectionTitle('Bestsellery')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('bestsellery')).toBeVisible();
    await expect(mainPage.getBestsellersSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Kategorie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('kategorie')).toBeVisible();
    await expect(mainPage.getCategoriesSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Nowości')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('nowosci')).toBeVisible();
    await expect(mainPage.getNewProductsSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Najczęściej kupowane przez Ciebie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('najczesciej-kupowane')).toBeVisible();
    await expect(mainPage.getRecentlyBoughtSection).toBeVisible();

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
  })
  
  test('W | Po kliknięciu baneru powitalnego użytkownik jest do niego przekierowany', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1210');

    await mainPage.getBannerUpperUp.click();
    await expect(page).toHaveURL(/\/pakiet-powitalny$/, { timeout: 10000 });
  })

  test('W | Po kliknięciu baneru dostawy użytkownik jest do niego przekierowany', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1211');

    await mainPage.getBannerUpperDown.click();
    await expect(page).toHaveURL(/\/o-dostawie\/koszty-dostawy$/, { timeout: 10000 });
  })

  test('W | Możliwość przewijania slidera promocji', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1212');
    
    const firstItemInSlider = page.locator('div[data-cy="promocje-product-card-slider"]').first()

    await mainPage.getSectionGetLeftButton.nth(0).isDisabled();
    await mainPage.getSectionGetRightButton.nth(0).click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(0).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(0).click();
    await expect(firstItemInSlider).toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(0).isDisabled();
  })
  
  test('W | Możliwość przejścia do promocji poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1213');

    await mainPage.getSectionShowAllLink('promocje').click();
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Promocje')).toBeVisible({ timeout: 10000 });
  })
  
  test('W | Możliwość przewijania slidera bestsellery', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1214');
    
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(700);

    const firstItemInSlider = page.locator('div[data-cy="bestsellery-product-card-slider"]').first()

    await mainPage.getSectionGetLeftButton.nth(1).isDisabled();
    await mainPage.getSectionGetRightButton.nth(1).click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(1).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(1).click();
    await expect(firstItemInSlider).toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(1).isDisabled();
  })
  
  test('W | Możliwość przejścia do bestsellerów poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1215');

    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(700);

    await mainPage.getSectionShowAllLink('bestsellery').click();
    await expect(page).toHaveURL(`${baseURL}` + '/bestsellery', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Bestsellery')).toBeVisible({ timeout: 10000 });
  })
    
  test('W | Możliwość przewijania slidera kategorii', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1216');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    
    const firstItemInSlider = page.locator('div[data-sentry-component="CategoriesSection"] section a[rel="nofollow"]').first()

    await mainPage.getSectionGetLeftButton.nth(2).isDisabled();
    await mainPage.getSectionGetRightButton.nth(2).click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(2).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(2).click();
    await expect(firstItemInSlider).toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(2).isDisabled();
  })
  
  test('W | Możliwość przejścia do wszystkich kategorii poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1217');

    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(700);

    await mainPage.getSectionShowAllLink('kategorie').click();
    await expect(page).toHaveURL(`${baseURL}` + '/kategorie', { timeout: 10000 });
    await expect(productsCategoriesPage.getProductsCategoriesTitle).toBeVisible();
  })

  test('W | Możliwość przejścia do wybranej kategorii ze slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1218');

    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(700);

    const firstItemInSlider = page.locator('div[data-sentry-component="CategoriesSection"] section a[rel="nofollow"]').first();
    const itemLink = await firstItemInSlider.getAttribute('href');
    const itemName = await firstItemInSlider.last().innerText();
    const modifiedItemName = itemName.length > 1 ? itemName.slice(1, -1) : '';

    await firstItemInSlider.click();
    await expect(page).toHaveURL(`${baseURL}` + itemLink, { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle(modifiedItemName)).toBeVisible({ timeout: 10000 });
  })

  test('W | Możliwość przewijania slidera nowości', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1219');
    
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(700);

    const firstItemInSlider = page.locator('div[data-cy="nowosci-product-card-slider"]').first()

    await mainPage.getSectionGetLeftButton.nth(3).isDisabled();
    await mainPage.getSectionGetRightButton.nth(3).click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(3).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(3).click();
    await expect(firstItemInSlider).toBeInViewport();
    await mainPage.getSectionGetLeftButton.nth(3).isDisabled();
  })
  
  test('W | Możliwość przejścia do nowości poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1220');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(700);

    await mainPage.getSectionShowAllLink('nowosci').click();
    await expect(page).toHaveURL(`${baseURL}` + '/nowosci', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nowości')).toBeVisible({ timeout: 10000 });
  })

  test('W | Możliwość przewijania slidera najczęściej kupowanych produktów', { tag: ['@Prod', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1221');
    
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(1000);

    const recentlyBoughtProductsCount = await page.locator('#most_frequently_bought div[data-sentry-component="ProductCard"]').count();
    const firstItemInSlider = page.locator('div[data-cy="most_frequently_bought-product-card-slider"]').first();

    if (recentlyBoughtProductsCount > 7) {
        await expect(mainPage.getSectionGetRightButton.nth(4)).toBeEnabled();
        await mainPage.getSectionGetRightButton.nth(4).click();
        await expect(firstItemInSlider).not.toBeInViewport();
        await mainPage.getSectionGetLeftButton.nth(4).click();
        await expect(firstItemInSlider).toBeInViewport();
    } else {
        await expect(mainPage.getSectionGetLeftButton.nth(4)).toBeDisabled();
        await expect(mainPage.getSectionGetRightButton.nth(4)).toBeDisabled();
    }
  })
  
  test('W | Możliwość przejścia do najczęściej kupowanych produktów poprzez link slidera', { tag: ['@Prod', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1222');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(700);

    await mainPage.getSectionShowAllLink('najczesciej-kupowane').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL(`${baseURL}` + '/najczesciej-kupowane', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Najcześciej kupowane przez Ciebie')).toBeVisible({ timeout: 15000 });
  })

  test('W | Możliwość przejścia do "Strefa Niskich Cen" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1223');

    await mainPage.getStrefaMamityButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/strefa-mamity', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Strefa Niskich Cen')).toBeVisible({ timeout: 15000 });
  })
    
  test('W | Możliwość przejścia do "Promocje" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1224');

    await mainPage.getDiscountsButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Promocje')).toBeVisible({ timeout: 15000 });
  })
    
  test('W | Możliwość przejścia do "Nowości" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1225');

    await mainPage.getNewProductsButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/nowosci', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Nowości')).toBeVisible({ timeout: 15000 });
  })
      
  test('W | Możliwość przejścia do "Bestsellery" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1226');

    await mainPage.getBestsellersButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/bestsellery', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nasze bestsellery')).toBeVisible({ timeout: 15000 });
  })
  
  test('W | Możliwość przejścia do "Ulubione" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1227');

    await mainPage.getFavouritesButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/profil/ulubione-produkty', { timeout: 10000 });
    await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible({ timeout: 15000 });
  })
      
  test('W | Możliwość przejścia do "Najczęściej kupowane" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Strona główna');
    await allure.epic('Webowe');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1228');

    await mainPage.getRecentlyBoughtButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/najczesciej-kupowane', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Najcześciej kupowane przez Ciebie')).toBeVisible({ timeout: 15000 });
  })

  test('W | Możliwość zapisania się do newslettera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    const userEmail = `${process.env.EMAIL}`

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(700);

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeDisabled();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
    expect(mainPage.getNewsletterCheckbox).not.toBeChecked;

    await mainPage.getNewsletterInput.fill(userEmail);
    await expect(mainPage.getNewsletterInput).toHaveValue(userEmail);
    await mainPage.getNewsletterCheckbox.check();
    await expect(mainPage.getNewsletterCheckbox).toBeChecked();
    await expect(mainPage.getNewsletterSubscribeButton).toBeEnabled();
    await mainPage.getNewsletterSubscribeButton.click();
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano do newslettera', { timeout: 10000 })
  })
})

