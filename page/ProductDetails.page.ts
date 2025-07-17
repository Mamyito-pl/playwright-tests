import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';


export default class ProductDetailsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickAddProductButton() {
        return this.getAddProductButton.click();
    }

    get getIncreaseProductButton() {
        //return this.page.locator('#add_to_cart_increment_button');
        return this.page.locator('div[class*="add_to_cart_increment_button"]');
    }

    get getDecreaseProductButton() {
        //return this.page.locator('#add_to_cart_decrement_button');
        return this.page.locator('div[class*="add_to_cart_decrement_button"]');
    }

    get getProductItemCount() {
        return this.page.locator('input[type="number"]');
    }

    get getAddProductButton() {
        return this.page.locator('div[class*="product-page-buttons"] button').getByText('Dodaj');
    }

    get getProductBrandName() {
        return this.page.locator('h1[data-sentry-element="ProductName"] a');
    }

    get getProductName() {
        return this.page.locator('h1[data-sentry-element="ProductName"]');
    }

    get getProductActualPriceTitle() {
        return this.page.locator('span[data-sentry-element="PriceLabel"]').getByText('Cena aktualna');
    }

    get getProductGrammar() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] span[data-sentry-element="ProductCapacity"]');
    }

    get getProductPricePerGrammar() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] p[data-sentry-element="PricePerGrammar"]');
    }

    get getProductPrice() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] p[data-sentry-element="CurrentPrice"]');
    }

    get getSetFirstQuantityButton() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] button[data-sentry-component="ProductSet"]').first();
    }

    get getSetSecondQuantityButton() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] button[data-sentry-component="ProductSet"]').nth(1);
    }

    get getMainInfoProductDropdown() {
        return this.page.locator('div[data-sentry-component="ProductDetailsAccordion"]').getByText('Informacje główne');
    }

    get getPackagingInfoDropdown() {
        return this.page.locator('div[data-sentry-component="ProductDetailsAccordion"]').getByText('Opakowanie');
    }

    get getProductDescriptionTitle() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="MobileContent"] h2[data-sentry-element="Title"]' : 'div[data-sentry-element="WebContent"] h2[data-sentry-element="Title"]').getByText('Opis produktu');;
    }

    get getOtherProductsFromThisCategorySectionTitle() {
        return this.page.getByText('Inne produkty z tej kategorii');
    }

    get getOtherProductsFromThisCategorySection() {
        return this.page.locator('#inne-produkty-z-tej-kategorii');
    }

    get getSectionShowAllLink() {
        return this.page.locator('#inne-produkty-z-tej-kategorii div[data-sentry-element="Controls"] a[href="/woda-i-napoje/woda/niegazowana"]:has-text("Zobacz wszystkie")');
    }

    get getSliderLeftButton() {
        return this.page.locator('#inne-produkty-z-tej-kategorii div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-left"]');
    }

    get getSliderRightButton() {
        return this.page.locator('#inne-produkty-z-tej-kategorii div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-right"]');
    }

    get getDeleteProductModal() {
        return this.page.locator('div[data-sentry-element="Modal"]');
    }

    get getConfirmDeleteModalButton() {
        return this.page.getByRole('button', { name: 'Potwierdź' });
    }

    get getAddToFavouritesButton() {
        return this.page.locator('div[data-sentry-element="ProductDetailsContent"] button[data-sentry-component="AddToFavouritesButton"]');
    }

    get getOtherProductsSectionTitle() {
        return this.page.locator('#inne-produkty-z-tej-kategorii h2').getByText('Inne produkty z tej kategorii');
    }

    get getOtherProductsSectionShowAllLink() {
        return this.page.locator('div[data-sentry-element="Header"] a[href="/woda-i-napoje/woda/niegazowana"]:has-text("Zobacz wszystkie")');
    }

    get getSliderSectionGetLeftButton() {
        return this.page.locator('#inne-produkty-z-tej-kategorii div[data-sentry-element="Header"] button svg[class*="tabler-icon tabler-icon-arrow-left"]');
    }

    get getSliderSectionGetRightButton() {
        return this.page.locator('#inne-produkty-z-tej-kategorii div[data-sentry-element="Header"] button svg[class*="tabler-icon tabler-icon-arrow-right"]');
    }
}