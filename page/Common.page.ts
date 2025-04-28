import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class CommonPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getMessage() {
        return this.page.locator('div[role="status"]');
    }

    get getLoader() {
        return this.page.locator('svg[class*="MuiCircularProgress-svg"]');
    }

    get getCartProductsCount() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="Content"] div[data-sentry-element="TabletContent"] #productsNumber' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Content"] div[data-sentry-element="WebContent"] #productsNumber');
    }

    get getCartProductsPrice() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="Content"] div[data-sentry-element="TabletContent"] div[data-sentry-element="IconLabel"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Amount"]');
    }
}