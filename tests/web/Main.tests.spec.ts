import { expect } from '@playwright/test';
import MainPage from '../../page/Main.page.ts';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import SearchbarPage from '../../page/Searchbar.page.ts';
import CartPage from '../../page/Cart.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods.ts';

test.describe('Testy strony głównej', async () => {

  let mainPage: MainPage;
  let menuCategoriesPage: MenuCategoriesPage;
  let searchbarPage: SearchbarPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'commit'})

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    await utility.addGlobalStyles(page);

    mainPage = new MainPage(page);
    menuCategoriesPage = new MenuCategoriesPage(page);
    searchbarPage = new SearchbarPage(page);
    cartPage = new CartPage(page);
  })

  test('W | Strona główna otwiera się ze wszystkimi wymaganymi polami', async () => {

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
    await expect(mainPage.getBannerUpperDown).toBeVisible();

    await expect(mainPage.getSectionTitle('Promocje')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('promocje')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Bestsellery')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('bestsellery')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Kategorie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('kategorie')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Nowości')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('nowosci')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Najczęściej kupowane przez Ciebie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('najczesciej-kupowane')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
  })
})

