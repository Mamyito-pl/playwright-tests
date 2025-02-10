import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class ProductsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickIncreaseProductButton() {
        return this.page.locator(selectors.ProductsPage.common.productCardIncreaseButton).click();
    }

    async clickDecreaseProductButton() {
        return this.page.locator(selectors.ProductsPage.common.productCardDecreaseButton).click();
    }

    getProductCategoryTitle(titleName: string) {
        return this.page.locator(this.mobile ? `div[data-sentry-element="TitleMobile"]:has-text("${titleName}")` : `div[data-sentry-element="Header"] h1:has-text("${titleName}")`);
    }
}