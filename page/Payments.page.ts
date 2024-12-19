import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class PaymentsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async checkStatue() {
        await this.page.check(selectors.PaymentsPage.common.statueCheckbox);
    }

    async enterBlikCode(blikCode: string) {
        await this.page.locator(selectors.PaymentsPage.common.blikPaymentInput).fill(blikCode);
    }

    get getOrderDetailsButton() {
        return this.page.locator(selectors.PaymentsPage.common.orderDetailsButton)
    }

    get getRepeatOrderButton() {
        return this.page.locator(selectors.PaymentsPage.common.repeatOrderButton)
    }

    get getBackHomeButton() {
        return this.page.locator(selectors.PaymentsPage.common.backHomeButton)
    }

    get getRepeatPaymentButton() {
        return this.page.locator(selectors.PaymentsPage.common.repeatPaymentButton)
    }

    get getPaymentOnDeliveryButton() {
        return this.page.locator(selectors.PaymentsPage.common.paymentOnDeliveryButton)
    }

    get getBlikTextboxPlaceholder() {
        return this.page.locator(selectors.PaymentsPage.common.blikTextboxPlaceholder);
    }

    get getBlikTextboxHelperText() {
        return this.page.locator(selectors.PaymentsPage.common.blikTextboxHelperText);
    }

    get getStatueCheckbox() {
        return this.page.locator(selectors.PaymentsPage.common.statueCheckbox);
    }
}