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

    async clickCartButton() {
        await this.getCartButton.click();
    }

    async clickModalCloseIcon() {
        await this.getModalCloseIcon.click({ force: true });
    }

    get getMessage() {
        return this.page.locator('div[role="status"]');
    }

    get getAlert() {
        return this.page.locator('div[role="alert"]').first();
    }

    get getLoader() {
        return this.page.locator('svg[class*="MuiCircularProgress-svg"]');
    }

    get getCartButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_button_mobile' : 'div[data-sentry-element="WebContent"] #cart_button');
    }

    get getCartProductsCount() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_button_mobile #productsNumber' : 'div[data-sentry-element="WebContent"] #cart_button #productsNumber');
    }

    get getCartProductsPrice() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_button_mobile div[data-sentry-element="IconLabel"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Amount"]');
    }

    get getModalCloseIcon() {
        return this.page.locator('svg[data-cy="modal-close-icon"]');
    }
}