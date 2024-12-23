import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class OrderDetailsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickPayButton() {
        await this.page.click(selectors.OrderDetailsPage.common.PayButton);
    }

    get getBackToOrdersButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.backToOrdersButton);
    }

    get getRepeatOrderButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.repeatOrderButton);
    }

    get getCancelOrderButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.cancelOrderButton);
    }

    get getPayButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.PayButton);
    }
}